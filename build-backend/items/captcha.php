<?php

function verify ($input, $random){
    $Alphabet = "abcdefghijklmnopqrstuvwxyz";
    $base = "secret" . $random;
    $digest = md5 ($base);
    for ($i = 0; $i < 6; $i++){
      $num = hexdec (substr ($digest, 2 * $i, 2)) % strlen ($Alphabet);
      if ($input[$i] != $Alphabet[$num]) return False;
    }
    return True;
  }