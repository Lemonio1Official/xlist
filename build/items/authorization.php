<?php

function getTodos($id){
    $todos = crud::r("todos", "*", "where uid = $id");
    $res = [];
    foreach($todos as $todo){
        $todo["priority"] = (int)$todo["priority"];
        $todo["reasons"] = json_decode($todo["reasons"]);
        $todo["days"] = json_decode($todo["days"]);
        $res[] = $todo;
    }
    
    return $res;
}

$logIn = function($x, $type){
    $captcha = verify($x['captcha'], $x["secret_word"]);
    if(!$captcha) return [false, "Invalid captcha"];
    if($type === "0"){
        $emails = crud::r("users", "email");
        if(array_search($x["email"], array_column($emails, "0")) === false){
            $values = [$x["email"], password_hash($x["password"], PASSWORD_BCRYPT)];
            if(crud::c("users", "email, password", $values)){
                $user = crud::r("users", "*", "where email = '$x[email]'");
                $user[0]["todos"] = getTodos($user[0]["id"]);
                return [true, $user[0]];
            }
            else return [false, "Something went wrong"];
        }else return [false, "Email already exists"];
    } else {
        $user = crud::r("users", "*", "where email = '$x[email]'");
        if(empty($user)) return [false, "User is not found"];
        if(password_verify($x["password"], $user[0]["password"])) {
            $user[0]["todos"] = getTodos($user[0]["id"]);
            return [true, $user[0]];
        }
        else return [false, "Incorrect password"];
    }
};

$loginGoogle = function($x){
    $user = crud::r("users", "*", "where email = '$x[email]'");
    if(empty($user)){
        $pass = substr(md5($x["email"]), 0, 10);
        $values = [$x["email"], password_hash($pass, PASSWORD_BCRYPT)];
        if(crud::c("users", "email, password", $values)){
            if(!mail($x["email"], "Successful registration on xlist", "Your login password without google: $pass")) 
            return [false, "The letter was not sent"];
            $user = crud::r("users", "*", "where email = '$x[email]'");
            return [true, $user[0]];
        } else return [false, "Something went wrong"];
    } else {
        $user[0]["todos"] = getTodos($user[0]["id"]);
        return [true, $user[0]];
    }
};

$checkUser = function($x){
    $user = crud::r("users", "*", "where email = '$x[email]'");
    if(empty($user)) return [false];
    if($user[0]["password"] !== $x["password"]) return [false];
    $user[0]["todos"] = getTodos($user[0]["id"]);
    return [true, $user[0]];
};