/**********************************************
*
* CryptoLions.io
*
***********************************************/

var _reqInterval = 100;

var LastBlockNum = -1;
var LastNodeChecked = -1;
var LastProducer = "";
var activated_interval;
var errorNodes = [];
$( document ).ready(function() {
	init()
});


function init(){
    initNodesList();
    activated_interval = setInterval (checkNodes, _reqInterval);
}


function checkNodes(){
    LastNodeChecked++;

    if (LastNodeChecked > blockProducerList.length-1)
    	LastNodeChecked = 0;
    updNodeCheckTime();
    getNode(LastNodeChecked);

}

function getNode(nodeID){

	var node_addr = blockProducerList[nodeID].node_addr;
	var node_p2p = blockProducerList[nodeID].port_p2p;
	var node_http = blockProducerList[nodeID].port_http;

	blockProducerList[nodeID].port_p2p
	var node_http_url = "http://"+node_addr+":"+node_http+"/v1/chain/get_info";
   	$("#c1_"+blockProducerList[nodeID].bp_name ).addClass( "bold" );

    get (node_http_url, nodeID, updateNodeInfo, nodeError)

}

function updateNodeInfo(node, nodeID){
	//server_version

   	$( "#c1_"+blockProducerList[nodeID].bp_name ).removeClass( "bold" );
	$( "#noderow_"+blockProducerList[nodeID].bp_name ).removeClass( "red" );

    blockProducerList[nodeID].lastCheck =  Number(new Date());

	if (errorNodes[blockProducerList[nodeID].bp_name]) {
		$( "#noderow_"+errorNodes[blockProducerList[nodeID].bp_name] ).removeClass( "redtblrow" );
		delete errorNodes[blockProducerList[nodeID].bp_name];
	}

   	if (LastBlockNum ==-1 || LastBlockNum < node.head_block_num){  //skip not synced nodes
	   	LastBlockNum = node.head_block_num;
		$('#lastBlock').html(node.head_block_num);
		$('#lastProducer').html(node.head_block_producer);
		$('#lastDate').html(convertUTCDateToLocalDate(new Date(node.head_block_time)));
		$('#lastIrrevBlock').html(node.last_irreversible_block_num);

		if (LastProducer != node.head_block_producer) {
			if (LastProducer)
				$( "#noderow_"+LastProducer ).removeClass( "greentblrow" );
			$( "#noderow_"+node.head_block_producer ).addClass( "greentblrow" );
			LastProducer = node.head_block_producer;
		}
	}
	$( "#c3_"+blockProducerList[nodeID].bp_name ).html(node.head_block_num);

}

function nodeError(reqest, nodeID){
   	$( "#c1_"+blockProducerList[nodeID].bp_name ).removeClass( "bold" );
	$( "#noderow_"+blockProducerList[nodeID].bp_name ).addClass( "redtblrow" );
	errorNodes[blockProducerList[nodeID].bp_name] = blockProducerList[nodeID].bp_name;
}


function updNodeCheckTime(){
	var now = Number(new Date());

	for (var bp in blockProducerList){
        var lastCheck = now;
        if (blockProducerList[bp].lastCheck) lastCheck = blockProducerList[bp].lastCheck;

		var spentTime = GetHummanTime(Math.floor(now - lastCheck)/1000);
		$('#c2_'+blockProducerList[bp].bp_name).html(spentTime);
	}
}

function initNodesList(){
	for (var bp in blockProducerList){

        var bpN = blockProducerList[bp].bp_name;
 		var lastCheck = "--";
 		var lastNodeBlock = "";
 		var node_http_url = "<a href='http://"+blockProducerList[bp].node_addr+":"+blockProducerList[bp].port_http+"/v1/chain/get_info' target='_blank'>"+blockProducerList[bp].port_http+"</a>";

 		$('#bpTable').append("<tr  id='noderow_"+bpN+"'> \
 								<td id='c0_"+bpN+"'>"+(bp*1+1)+"</td> \
 								<td id='c1_"+bpN+"'>"+blockProducerList[bp].bp_name+"</td> \
 								<td id='c2_"+bpN+"'>"+lastCheck+"</td> \
 								<td id='c3_"+bpN+"'>"+lastNodeBlock+"</td> \
								<td>"+blockProducerList[bp].node_addr+"</td> \
 								<td>"+node_http_url+"</td> \
 								<td>"+blockProducerList[bp].port_p2p+"</td> \
 								<td>"+blockProducerList[bp].organisation+"</td> \
 								<td>"+blockProducerList[bp].location+"</td> \
 							</tr>");

	}

}


//-------------------------------------------------------------------------------
function get (url, nodeID, successCallback, errorCallback) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);

	request.onload = function () {
		if (request.status === 200) {
			successCallback(JSON.parse(request.responseText), nodeID);
		} else {
			errorCallback(request, nodeID);
		}
	};

	request.onerror = function (request) {
		//console.log('error:' + nodeID);
		errorCallback(request, nodeID);
	};

	request.send();
}


function GetHummanTime (sec){
	var HM = humanTimingAPI(sec, 0);

	var humanTiming = "";
	for (var k in HM){
		humanTiming = humanTiming + HM[k].time + HM[k].label;
	}

	if (!humanTiming) humanTiming = '0 sec';
		humanTiming += " ago";

	return humanTiming;


}
