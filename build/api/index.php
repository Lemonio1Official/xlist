<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include "router.php";
include "crud.php";
include "../service.php";

get('api/test', $test);
post('api/login/$type', $logIn);
post('api/login/google', $loginGoogle);
post('api/check/user', $checkUser);
post('api/update/schedule/$id', $updateSchedule);
post('api/update/freetime/$id', $updateFreetime);
post('api/update/reasons/$id', $updateReasons);
post('api/add/todo', $addTodo);
post('api/delete/todo', $deleteTodo);
post('api/update/todo', $updateTodo);
post('api/get/todayalltodos', $getTodayAllTodos);
post('api/set/todaytodos/$id', $setTodayTodos);
post('api/get/todaytodos', $getTodayTodos);
post('api/set/task/done', $setDone);
post('api/get/stats', $getStats);

r();