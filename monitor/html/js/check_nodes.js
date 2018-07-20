/* ###############################################################################
#
# EOS TestNet Monitor
#
# Created by http://CryptoLions.io
#
# Git Hub: https://github.com/CryptoLions/EOS-Testnet-monitor
#
############################################################################### */

var LastBlockNum = -1;
var LastNodeChecked = -1;
var LastProducer = "";
var activated_interval;
var errorNodes = [];
var skipBETurn = 0;
var socket;
var nodesResponseTime = [];
var blockProducerList = [];
var _showNodeInfo = 1;

$(document).ready(function() {
  init();
});

function init() {
  socket = io(eosMonitorServer);
  socket.on('blockprod_update', function(msg) {
    updateBEprod(msg);
  });

  socket.on('blockupdate', function(msg) {
    $('#totProcessedBlocks').html(msg.block_num);
  });

  socket.on('get_info', function(msg) {
    updateNodeInfo(msg, msg.nodeid);
  });

  socket.on('error_node', function(msg) {
    nodeError("", msg);
  });

  socket.on('ping', function(msg) {
    if (msg && msg.nodeid >= 0) {
      if (blockProducerList.length == 0)
        return;
      $("#resp_time_n0_" + blockProducerList[msg.nodeid].bp_name).addClass("black");
      //$("#c1_"+blockProducerList[msg.nodeid].bp_name ).addClass( "bold" );
    }
  });

  socket.on('initNodes', function(msg) {
    blockProducerList = msg;
    initNodesList();
  });

  socket.on('initProducersStats', function(msg) {
    for (var k in msg)
      updateBEprod(msg[k]);
    }
  );

  socket.on('reload', function(msg) {
    location.reload();
  });

  socket.on('transaction', function(msg) {
    transactionController(msg);
  });
  socket.on('usersonline', function(msg) {
    $('#connectedUsers').html(msg);
  });

  socket.on('api', function(msg) {
    $('#modal_body').html('<pre id="json">' + JSON.stringify(msg, null, 2) + '</pre>');
  });

  socket.on('console', function(msg) {
    console.log(msg);
  });

  initNodesList();

  activated_interval = setInterval(checkNodes, 500);
  showHideNodeInfo(true);
  $(".showHideAddresInfo").click(showHideNodeInfo);

  $("#btn_API_req").click(function() {
    var api_req = $('#api_req').val();
    var api_data = $('#api_data').val();
    //console.log({"api": api_req, "data": api_data});

    socket.emit("api", {
      "api": api_req,
      "data": api_data
    });

  });

  $("#apiPopup").click(function() {
    $('#modal_body').html("");

    $('#apiInput').show();
    $('#modalheaderTitle').hide();

    $('#myModal').modal('show');
  });

  $("#p2pPopup").click(function() {
    $('#modal_body').html("");

    $('#apiInput').hide();
    $('#modalheaderTitle').show();
    $('#modalheaderTitle').html("P2P List for config.ini");

    var peer_list = "";
    for (var bpp in blockProducerList) {
      if (blockProducerList[bpp].bp && blockProducerList[bpp].enabled)
        peer_list += "p2p-peer-address = " + blockProducerList[bpp].node_addr + ":" + blockProducerList[bpp].port_p2p + "<BR>";
      }

    $('#modal_body').html('<span id="peer_list" onclick="fnSelect(\'peer_list\')">' + peer_list + '</span>');

    $('#myModal').modal('show');
  });

}

function showBlock(block) {
  var api_req = "/v1/chain/get_block";
  $('#api_req').val(api_req);

  var api_data = '{"block_num_or_id": ' + block + '}';
  $('#api_data').val(api_data);
  socket.emit("api", {
    "api": api_req,
    "data": api_data
  });

  $('#modal_body').html("");
  $('#apiInput').show();
  $('#modalheaderTitle').hide();
  $('#myModal').modal('show');

}

function showHideNodeInfo(displayOnly) {

  if (!displayOnly)
    _showNodeInfo = !_showNodeInfo;

  if (_showNodeInfo) {
    $(".c6").hide();
    $(".c7").hide();
    $(".c8").hide();
    $(".c9").hide();

    $(".c12").show();
    $(".c13").show();
    $("#showHideAddresInfo").show();

    _showNodeInfo = false;
  } else {
    $(".c6").show();
    $(".c7").show();
    $(".c8").show();
    $(".c9").show();
    $(".c12").hide();
    $(".c13").hide();

    $("#showHideAddresInfo").hide();
    _showNodeInfo = true;
  }
}

function updateBEprod(data) {
  $('#c12_' + data.name).html(data.produced);
  $('#c13_' + data.name).html(data.tx_count);
}

function checkNodes() {
  updNodeCheckTime();
}

function updateNodeInfo(node, nodeID) {
  if (blockProducerList.length == 0)
    return;

  //$( "#c1_"+blockProducerList[nodeID].bp_name ).removeClass( "bold" );
  $("#resp_time_n0_" + blockProducerList[nodeID].bp_name).removeClass("black");

  if (node.ping)
    $("#resp_time_n0_" + blockProducerList[nodeID].bp_name).html("[" + node.ping + "ms]");

  if (node.txs)
    $('#txCount').html(node.txs);

  if (node.txblocks)
    $('#nonEmptyBlockCount').html(node.txblocks);

  $("#noderow_" + blockProducerList[nodeID].bp_name).removeClass("red");

  blockProducerList[nodeID].lastCheck = Number(new Date());

  if (errorNodes[blockProducerList[nodeID].bp_name]) {
    $("#noderow_" + errorNodes[blockProducerList[nodeID].bp_name]).removeClass("redtblrow");
    delete errorNodes[blockProducerList[nodeID].bp_name];
  }

  if (LastBlockNum == -1 || LastBlockNum < node.head_block_num) { //skip not synced nodes
    LastBlockNum = node.head_block_num;
    $('#lastBlock').html(formatBogNumbers(node.head_block_num));
    $('#lastProducer').html(node.head_block_producer);
    $('#lastDate').html(convertUTCDateToLocalDate(new Date(node.head_block_time)));
    $('#lastIrrevBlock').html(node.last_irreversible_block_num);

    if (LastProducer != node.head_block_producer) {
      if (LastProducer)
        $("#noderow_" + LastProducer).removeClass("greentblrow");
      $("#noderow_" + node.head_block_producer).addClass("greentblrow");
      LastProducer = node.head_block_producer;
    }

    var producerID = getProducerID(node.head_block_producer);
    if (producerID >= 0)
      blockProducerList[producerID].producedTime = Number(new Date());

    blockProducerList[nodeID].lastCheck = Number(new Date());
    $("#c4_" + node.head_block_producer).html(node.head_block_num);
  }

  $("#c3_" + blockProducerList[nodeID].bp_name).html(node.head_block_num);
  $("#c6_" + blockProducerList[nodeID].bp_name).html(parseInt("0x" + node.server_version));

}

function nodeError(reqest, nodeID) {
  if (blockProducerList.length == 0)
    return;

  $("#resp_time_n0_" + blockProducerList[nodeID].bp_name).html("[--ms]");

  //$( "#c1_"+blockProducerList[nodeID].bp_name ).removeClass( "bold" );
  $("#resp_time_n0_" + blockProducerList[nodeID].bp_name).removeClass("black");

  $("#noderow_" + blockProducerList[nodeID].bp_name).addClass("redtblrow");
  errorNodes[blockProducerList[nodeID].bp_name] = blockProducerList[nodeID].bp_name;
}

function getProducerID(bpn) {
  for (var bp in blockProducerList) {
    if (blockProducerList[bp].bp_name == bpn) {
      return bp;
    }
  }
  return -1;
}

function updNodeCheckTime() {
  var now = Number(new Date());

  for (var bp in blockProducerList) {
    var lastCheck = now;
    var lastProduced = 0;
    if (blockProducerList[bp].lastCheck)
      lastCheck = blockProducerList[bp].lastCheck;

    if (blockProducerList[bp].producedTime)
      lastProduced = blockProducerList[bp].producedTime;

    var spentTime = GetHummanTime(Math.floor(now - lastCheck) / 1000);

    $('#c2_' + blockProducerList[bp].bp_name).html(spentTime);

    if (lastProduced) {
      var produceTime = GetHummanTime(Math.floor(now - lastProduced) / 1000);
      $('#c5_' + blockProducerList[bp].bp_name).html(produceTime);
    }
  }
}

function transactionController(msg) {
  var lt = /</g,
    gt = />/g,
    ap = /'/g,
    ic = /"/g;
  msg = msg.toString().replace(lt, "&lt;").replace(gt, "&gt;").replace(ap, "&#39;").replace(ic, "&#34;");
  if (!this.tblStripe) {
    this.tblStripe = 1;
  } else {
    this.tblStripe = 0;
  }

  var newRow = $(' \
		<tr class="strip_' + this.tblStripe + '"> \
			<td><a href="#" onclick="showBlock(' + msg.c1 + ')">' + msg.c1 + '</a></td> \
			<td>' + msg.c2 + '</td> \
			<td>' + msg.c3 + '</td> \
			<td>' + msg.c4 + '</td> \
			<td>' + msg.c5 + '</td> \
			<td>' + msg.c6 + '</td> \
		</tr> \
		');

  $('#txTable').prepend(newRow.wrapInner('<div style="display: none;" />'));
  $('#txTable tr:first').children('div').slideDown(200);

  if ($('#txTable').height() > 200) {

    while ($('#txTable').height() > 230) {
      $('#txTable tr:last').remove();
    }
    var lstRow = $('#txTable tr:last');
    lstRow.children('div').fadeOut(50, function() {
      lstRow.remove();
    });
  }

  /*
    if ($('#txTable tr').length > 6) {
		while ($('#txTable tr').length > 7 ){
			$('#txTable tr:last').remove();
		}
        var lstRow = $('#txTable tr:last');
    	lstRow.children('div').fadeOut(50, function(){lstRow.remove();});
    }
    */

}

function initNodesList() {
  $('#table-body').empty();
  $('#table-body-node').empty();

  if (blockProducerList.count == 0)
    return;

  var nodesBPCount = 0;
  var nodesCount = 0;

  for (var bp_ in blockProducerList) {
    if (!blockProducerList[bp_].enabled)
      continue;
    var bpN = blockProducerList[bp_].bp_name;
    var lastCheck = "--";
    var lastNodeBlock = "";
    var lastNodeBlockProduced = "--";
    var lastNodeBlockProducedTime = "--";
    var nodeVersion = "--";
    var node_http_url = "<a href='http://" + blockProducerList[bp_].node_addr + ":" + blockProducerList[bp_].port_http + "/v1/chain/get_info' target='_blank'>" + blockProducerList[bp_].port_http + "</a>";

    var toolTip_inf = "Address: " + blockProducerList[bp_].node_addr + "   \
								HTTP: " + blockProducerList[bp_].port_http + "  \
							 	P2P: " + blockProducerList[bp_].port_p2p;

    var response_time = "<span class='resp_time' id='resp_time_n0_" + bpN + "'> [--ms]</span>";
    if (blockProducerList[bp_].bp == true) {
      nodesBPCount++;

      $('#bpTable').append("<tr id='noderow_" + bpN + "' class='tblrow text-center'> \
 								<td class='c0' id='c0_" + bpN + "'>" + "<span data-toggle='tooltip' data-placement='top' title='" + toolTip_inf + "'>" + (
      nodesBPCount) + "</span>" + response_time + " </td> \
 								<td class='c1' id='c1_" + bpN + "'>" + blockProducerList[bp_].bp_name + "</td> \
 								<td class='c2' id='c2_" + bpN + "'>" + lastCheck + "</td> \
 								<td class='c3' id='c3_" + bpN + "'>" + lastNodeBlock + "</td> \
								<td class='c5' id='c5_" + bpN + "'>" + lastNodeBlockProducedTime + "</td> \
								<td class='c4' id='c4_" + bpN + "'>" + lastNodeBlockProduced + "</td> \
								<td class='c7' id='c7_" + bpN + "'>" + blockProducerList[bp_].node_addr + "</td> \
 								<td class='c8' id='c8_" + bpN + "'>" + node_http_url + "</td> \
 								<td class='c9' id='c9_" + bpN + "'>" + blockProducerList[bp_].port_p2p + "</td> \
 								<td class='c6' id='c6_" + bpN + "'>" + nodeVersion + "</td> \
 								<td class='c12' id='c12_" + bpN + "'>--</td> \
 								<td class='c13' id='c13_" + bpN + "'>--</td> \
 								<td class='c10' id='c10_" + bpN + "'>" + blockProducerList[bp_].organisation + "</td> \
 								<td class='c11' id='c11_" + bpN + "'>" + blockProducerList[bp_].location + "</td> \
 							</tr>");
    } else {
      nodesCount++;
      $('#nodeTable').append("<tr id='noderow_" + bpN + "' class='tblrow text-center'> \
 								<td class='cn0' id='c0_" + bpN + "'>" + "<span data-toggle='tooltip' data-placement='top' title='" + toolTip_inf + "'>" + (
      nodesCount) + "</span>" + response_time + " </td> \
 								<td class='cn1' id='c1_" + bpN + "'>" + blockProducerList[bp_].bp_name + "</td> \
 								<td class='cn2' id='c2_" + bpN + "'>" + lastCheck + "</td> \
 								<td class='cn3' id='c3_" + bpN + "'>" + lastNodeBlock + "</td> \
								<td class='cn4' id='c7_" + bpN + "'>" + blockProducerList[bp_].node_addr + "</td> \
 								<td class='cn5  id='c8_" + bpN + "'>" + node_http_url + "</td> \
 								<td class='cn6' id='c9_" + bpN + "'>" + blockProducerList[bp_].port_p2p + "</td> \
 								<td class='cn7' id='c6_" + bpN + "'>" + nodeVersion + "</td> \
 								<td class='cn8' id='cn10_" + bpN + "'>" + blockProducerList[bp_].organisation + "</td> \
 								<td class='cn9' id='cn11_" + bpN + "'>" + blockProducerList[bp_].location + "</td> \
 							</tr>");

    }

  }
  $('[data-toggle="tooltip"]').tooltip();

  $('#infoMsg').html("");

  showHideNodeInfo(false);
}

// -------------------------------------------------------------------------------
