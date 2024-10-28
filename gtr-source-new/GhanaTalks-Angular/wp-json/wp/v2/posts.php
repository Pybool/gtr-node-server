<?php

$name = $_GET['slug'];

if ($name != null) {
    echo file_get_contents("http://www.wordpress.ghanatalksradio.com/wp-json/wp/v2/posts?slug=".$name);
}


?>