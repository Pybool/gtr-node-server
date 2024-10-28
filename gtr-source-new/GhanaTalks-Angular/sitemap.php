<?php
function categorySitemap($datas,$name){
	$xml = new SimpleXMLElement('<?xml version="1.0" encoding="utf-8" ?><?xml-stylesheet type="text/xsl" href="https://www.ghanatalksradio.com/sitemap/sitemap.xsl"?><urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/siteindex.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
	foreach($datas as $data){
		$url= $xml->addChild('url');
	   $url->addChild('loc', "https://www.ghanatalksradio.com/category/".$data);
	   $url->addChild('lastmod', date('c'));
	   $url->addChild('changefreq', "always");
	   $url->addChild('priority', "1.0");
   
}
$xml->asXML('sitemap/'.$name);
}
function postSitemap($datas,$name){
	$xml = new SimpleXMLElement('<?xml version="1.0" encoding="utf-8" ?><?xml-stylesheet type="text/xsl" href="https://www.ghanatalksradio.com/sitemap/sitemap.xsl"?><urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/siteindex.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
	foreach($datas as $data){
			$url= $xml->addChild('url');
		   $url->addChild('loc', "https://www.ghanatalksradio.com/".$data['post']);
		   $url->addChild('lastmod', $data['date']);
		   $url->addChild('changefreq', "always");
		   $url->addChild('priority', "1.0");
	   
	}
	$xml->asXML('sitemap/'.$name);
}
function defaultSitemap($datas){
	$xml = new SimpleXMLElement('<?xml version="1.0" encoding="utf-8" ?><?xml-stylesheet type="text/xsl" href="https://www.ghanatalksradio.com/sitemap/sitemap.xsl"?><sitemapindex xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/siteindex.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></sitemapindex>');
	foreach($datas as $data){
	$sitemap= $xml->addChild('sitemap');
	   $sitemap->addChild('loc', "https://www.ghanatalksradio.com/sitemap/".$data['name']);
	   $sitemap->addChild('lastmod', $data['time']);
}
$xml->asXML('sitemap.xml');

}


$res=sitemap();
if($res['status']){
	$defaullt_array=array();
	array_push($defaullt_array,array('name'=>'sitemap-tax-category.xml','time'=>date('c')));
	
	foreach(array_reverse($res['data']) as $data){
		
		postSitemap($data[1],'sitemap-pt-post-'.$data[0].'.xml');
		array_push($defaullt_array,array('name'=>'sitemap-pt-post-'.$data[0].'.xml','time'=>$data[1][count($data[1])-1]['date']));
	}
	
	categorySitemap($res['category'],'sitemap-tax-category.xml');
	defaultSitemap($defaullt_array);
	echo "done";
}
function sitemap()
	{
		$mysqli = new mysqli("db5000105138.hosting-data.io","dbu134116","Businessman123)","dbs99625");

// Check connection
if ($mysqli -> connect_errno) {
  echo "Failed to connect to MySQL: " . $mysqli -> connect_error;
  exit();
}
		$date1 = date('Y-m-d',strtotime('2019-06-01'));
		 $date2 = date('Y-m-d',strtotime('now'));
		 $d1=new DateTime($date2); 
		 $d2=new DateTime($date1);                                  
		 $Months = $d2->diff($d1); 
		 $howeverManyMonths = (($Months->y) * 12) + ($Months->m);
		 $allresult=array();
		 if($howeverManyMonths>0){
			 $dater= date('Y-m-15',strtotime($date1));
			 for($i=0;$i<=$howeverManyMonths;$i++){
				
				$sql = "SELECT * FROM talktalkwp_posts WHERE post_type='post' AND post_status='publish' AND post_date>='".date('Y-m-01',strtotime($dater))."' AND post_date<='".date('Y-m-t',strtotime($dater))."' ORDER BY post_date ASC";
				$result = $mysqli->query($sql);
				$mini=array();
				if ($result->num_rows > 0) {
					// output data of each row
					while($row = $result->fetch_assoc()) {
						array_push($mini,array('date'=>date('c',strtotime($row['post_modified'])),'post'=>$row['post_name']));
					}
				  }
				  array_push($allresult,array(date('Y-m',strtotime($dater)),$mini));
				  $dater=date('Y-m-15',strtotime('+1 month',strtotime($dater)));
				}
			
			$slug=array();
			$sql = "SELECT * FROM talktalkwp_term_taxonomy WHERE taxonomy='category'";
			$result = $mysqli->query($sql);
			if ($result->num_rows > 0) {
				// output data of each row
				while($row = $result->fetch_assoc()) {
					$sql1 = "SELECT * FROM talktalkwp_terms WHERE term_id=".$row['term_id'];
					$result1 = $mysqli->query($sql1);
					if ($result1->num_rows > 0) {
						while($row1 = $result1->fetch_assoc()) {
							array_push($slug,$row1['slug']);
							break;
						}
					}
					
				}
			  }
		
			return array('status'=>true,'data'=>$allresult,'category'=>$slug,'timer'=>date('c')); 
		 }else{
			return array('status'=>false);
		 }
			
		
       
	}
?>