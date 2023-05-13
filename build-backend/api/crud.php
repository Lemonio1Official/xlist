<?php

include "config.php";

try{$pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);}
catch (PDOException $e) {echo 'Error connect to database '.$e->getMessage();}

class crud {
    public static function pdo() {
        global $pdo;
        return $pdo;
    }
    public static function c(string $table, string $fields, array $values){
        $plug = implode(",", array_map(function(){return "?";},$values));
        return self::pdo()->prepare("INSERT INTO $table ($fields) VALUES ($plug)")->execute($values);
    }
    public static function r(string $table, string $fields, string $params = ""){
        return self::pdo()->query("SELECT $fields FROM $table $params")->fetchAll();
    }
    public static function u(string $table, string $fields, string $params){
        return self::pdo()->prepare("UPDATE $table SET $fields $params")->execute();
    }
    public static function d(string $table, string $params){
        return self::pdo()->prepare("DELETE FROM $table $params")->execute();
    }
}