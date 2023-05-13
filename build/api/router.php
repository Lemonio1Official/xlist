<?php

$urls = [];
$reqSplit = explode("/", explode("?", $_SERVER['REQUEST_URI'])[0]);

function addReq($url, $callback, $name){
    global $urls, $reqSplit;
    if(substr($url, 0, 1) !== "/") $url = "/" . $url;
    $urlSplit = explode("/", $url);
    $finallyUrl = [];
    $params = [];
    for ($i=0; $i < count($urlSplit); $i++) { 
        if(strpos($urlSplit[$i], "$") === 0){
            if(isset($reqSplit[$i])){
                $finallyUrl[] = $reqSplit[$i];
                $params[] = $reqSplit[$i];
            }else 
                $finallyUrl[] = $urlSplit[$i];
        }else $finallyUrl[] = $urlSplit[$i];
    }
    $finallyUrl = json_encode($finallyUrl);
    $urls[$finallyUrl] = [$name, $callback, $params];
}

function r(){
    global $urls, $reqSplit;
    $reqUrl = json_encode($reqSplit);
    if (isset($urls[$reqUrl])){
        if(strtoupper($urls[$reqUrl][0]) === $_SERVER["REQUEST_METHOD"]){
            if($_SERVER["REQUEST_METHOD"] === "GET"){
                echo json_encode($urls[$reqUrl][1](...$urls[$reqUrl][2]));
            }else{
                $content = [];
                foreach(json_decode(file_get_contents('php://input')) as $k => $v){$content[$k] = $v;}
                echo json_encode($urls[$reqUrl][1]($content, ...$urls[$reqUrl][2]));
            }
        }
    }else header( 'HTTP/1.0 404 Not Found', TRUE, 404 );
}

function get($url, $callback){addReq($url, $callback, __FUNCTION__);}
function post($url, $callback){addReq($url, $callback, __FUNCTION__);}