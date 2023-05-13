<?php
include "items/captcha.php";
include "items/authorization.php";

$updateSchedule = function($x, $id){
    $schedule = crud::r("users", "schedule", "where id = $id")[0][0];
    $schedule = explode(" - ", $schedule);
    for ($i=0; $i < 2; $i++) { 
        if($i === $x["id"]) $schedule[$i] = $x["time"];
        else $schedule[$i] = $schedule[$i];
    }
    $schedule = implode(" - ", $schedule);
    if(crud::u("users", "schedule='$schedule'", "where id = $id")) return [true, $schedule];
    else return [false, "Something went wrong"];
};

$updateFreetime = function($x, $id){
    if(crud::u("users", "freetime='$x[freetime]'", "where id = $id")) return [true, $x];
    else return [false, "Something went wrong"];
};

$updateReasons = function($x, $id){
    if(crud::u("users", "reasons='$x[reasons]'", "where id = $id")) return [true, $x];
    else return [false, "Something went wrong"];
};

$addTodo = function($x){
    $values = [];
    foreach($x as $k => $v){
        if(is_array($v))
        $values[] = json_encode($v);
        else $values[] = $v;
    }
    if(crud::c("todos", "uid,task,extime,priority,reasons,days", $values)) return [true, $x];
    else return [false, "Something went wrong"];
};

$deleteTodo = function($x){
    if(crud::d("todos", "where task = '$x[task]' and uid = $x[id]")) return [true, "Task has been deleted"];
    else return [false, "Something went wrong"];
};

$updateTodo = function($x){
    $todo = $x["todo"];
    $todo->reasons = json_encode($todo->reasons);
    $todo->days = json_encode($todo->days);
    if(crud::u("todos", 
    "task='$todo->task', extime=$todo->extime, priority=$todo->priority, reasons='$todo->reasons', days='$todo->days'",
    "where task = '$x[task]' and uid = $x[id]"))
    return [true, "Successfully edited"];
    else return [false, "Something went wrong"];
};

$getTodayAllTodos = function($x){
    $todos = crud::r("todos", "*", "where uid = $x[id]");
    $day = (int)date('N', strtotime('-1 day', time()));
    if($day === 0) $day = 6;
    $todayTodos = [];
    foreach($todos as $todo){
        $todo["days"] = json_decode($todo["days"]);
        if(in_array($day, $todo["days"])){
            $todo["reasons"] = json_decode($todo["reasons"]);
            $todayTodos[] = $todo;
        }
    }
    return $todayTodos;
};

$setTodayTodos = function($x, $id){
    $user = crud::r("users", "schedule, freetime", "where id=$id")[0];
    $day = date('d.m.Y', strtotime("d"));
    $todos = array_map(function($i){
        return [
            "task"=>$i->task,
            "priority"=>(int)$i->priority,
            "extime"=>round_up((int)$i->extime / 5) * 5,
            "reasons"=>["true"],
            "done"=>false
        ];
    }, $x["todos"]);
    $todos = mySort($todos, function($a, $b){
        return $b["priority"] - $a["priority"];
    });
    for ($i=0; $i < count($todos); $i++) { 
        if(isset($todos[$i + 1])){
        $rand = random_int(0, 1);
        if($todos[$i]["priority"] === $todos[$i + 1]["priority"])
        if($rand > 0) [$todos[$i],$todos[$i+1]] = [$todos[$i+1],$todos[$i]];
        }
    }
    $fromTo = timeSTN($user["schedule"]);
    $ftArr = array_map(function($i){return timeSTN($i);}, json_decode($user["freetime"]));
    $freetime = $fromTo[1] - $fromTo[0];
    foreach($ftArr as $time){
        $freetime = $freetime - ($time[1] - $time[0]);
    }
    for ($i=0; $i < count($todos); $i++) { 
        $temp = $freetime - $todos[$i]["extime"];
        if($temp > 0) $freetime = $temp;
        else {
            $todos = array_slice($todos, 0, $i);
            break;
        }
    }
    $Break = round_down($freetime * 0.8 / count($todos) / 5) * 5;
    $todos = builder($user["schedule"], json_decode($user["freetime"]), $todos, $Break);

    $today = json_encode([$day,$todos], JSON_UNESCAPED_UNICODE);
    if(crud::u("users", "today='$today'", "where id = $id")) return [true, $todos];
    else return [false, "Something went wrong"];
};

$getTodayTodos = function($x){
    $todos = crud::r("users", "today", "where id = $x[id]");
    if($todos[0][0]){
        $day = date('d.m.Y', strtotime("d"));
        $todos = json_decode($todos[0][0]);
        if($todos[0] === $day){
            return [true, $todos[1]];
        }else {
            $startDay = strtotime($todos[0]);
            $score = 0;
            $oTodos = [];
            foreach($todos[1] as $i){
                if(!find($oTodos, function($e, $i){
                    return $e->task === $i->task;
                }, $i))
                $oTodos[] = $i;
            }
            foreach($oTodos as $i){
                if($i->done)
                switch ($i->priority) {
                    case 0:
                        $score += 10;
                        break;
                    case 1:
                        $score += 4;
                        break;
                    case 2:
                        $score += 2;
                        break;
                }   
            }
            crud::c("stats", "uid,date,score", [$x["id"], $todos[0], $score]);
            $currDay = false;
            while (!$currDay) {
                $startDay = strtotime('+1 day', $startDay);
                if($startDay === strtotime($day)) {
                    $currDay = true;
                    crud::u("users", "today=''", "where id = $x[id]");
                }else{
                    $date = date("d.m.Y", $startDay);
                    crud::c("stats", "uid,date,score", [$x["id"], $date, 0]);
                }                
            }
            return [false, "Not this day"];
        }
    }else return [false, "empty"];
};

$setDone = function($x){
    $today = crud::r("users", "today", "where id=$x[id]")[0]["today"];
    $today = json_decode($today);
    $day = $today[0];
    $todos = $today[1];
    for ($i=0; $i < count($todos); $i++) { 
        $e = $todos[$i];
        if($e->task===$x["task"])
        $todos[$i]->done = !$e->done;
    }
    $today = [];
    $today[] = $day;
    $today[] = $todos;
    $today = json_encode($today, JSON_UNESCAPED_UNICODE);
    if(crud::u("users", "today='$today'", "where id=$x[id]")) return [true, $todos];
    else return [false, "Something went wrong"];
};

$getStats = function($x){
    $stats = crud::r("stats", "score, date", "where uid=$x[id]");
    if(isset($stats[0])) return [true,$stats];
    else return [false, "empty"];
};

$test = function(){
    $testArr = [
        ["id"=>1, "text"=>"hello"],
        ["id"=>2, "text"=>"hi"],
        ["id"=>3, "text"=>"bonjuh"],
        ["id"=>4, "text"=>"privet"],
    ];

    return find($testArr, function($i){
        return $i["text"] === "hello2";
    });
};

function builder($schedule, $freetime, $todos, $Break) {
    $scheduleNum = timeSTN($schedule);
    $freetimeNum = array_map(function($i){return timeSTN($i);}, $freetime);
    $newTodos = array();
    $from = $scheduleNum[0];
    $to = 0;
    function checkTime($time, $todo, &$newTodos, &$freetimeNum) {
        for ($i = 0; $i < count($freetimeNum); $i++) {
          $e = $freetimeNum[$i];
          $start = $time[0] >= $e[0] && $time[0] < $e[1];
          $end = $time[1] > $e[0] && $time[1] <= $e[1];
          $between = $time[0] <= $e[0] && $time[1] >= $e[1];
          $extime = $time[1] - $time[0];
          if ($start) {
            $time = checkTime(array($e[1], $e[1] + $extime), $todo, $newTodos, $freetimeNum);
            break;
          }
          if ($end || $between) {
            $time[1] = $e[0];
            $rest = $extime - ($time[1] - $time[0]);
            $todo['time'] = timeNTS($time);
            $newTodos[] = $todo;
            $time = checkTime(array($e[1], $e[1] + $rest), $todo, $newTodos, $freetimeNum);
            break;
          }
        }
        return $time;
      }
    for ($i = 0; $i < count($todos); $i++) {
      $e = $todos[$i];
      $to = $from + $e['extime'];
      [$from, $to] = checkTime(array($from, $to), $todos[$i], $newTodos, $freetimeNum);
      $e['time'] = timeNTS(array($from, $to));
      $newTodos[] = $e;
      $from = $to + $Break;
    }
  
    return $newTodos;
}

function timeSTN($str){
    return array_map(function ($i){
        $time = explode(":", $i);
        return $time[0] * 60 + $time[1];
    },explode(" - ", $str));
}

function timeNTS($arr){
    return implode(" - ", array_map(function($i){
        $hours = round_down($i/60);
        $minStr = "0" . $i - ($hours * 60);
        $mins = substr($minStr, -2, 2);
        return $hours.":".$mins;
    }, $arr));
}

function round_up($number){
    $fig = (int) str_pad('1', 0, '0');
    return (ceil($number * $fig) / $fig);
}

function round_down($number){
    $fig = (int) str_pad('1', 0, '0');
    return (floor($number * $fig) / $fig);
}

function mySort($arr, $cb){
    for ($c=0; $c < count($arr); $c++) {
    for ($i=0; $i < count($arr); $i++) {
        if(!isset($arr[$i+1])) break;
        if($cb($arr[$i], $arr[$i+1]) < 0){
            [$arr[$i], $arr[$i + 1]] = [$arr[$i + 1], $arr[$i]];
        }
    }}
    return $arr;
};

function find($array, $cb, $deps = false){
    foreach($array as $i){
        if($cb($i, $deps)) return true;
    }
    return false;
}