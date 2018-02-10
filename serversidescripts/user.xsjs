var sql;
var param;
var METHOD = $.request.method;

var conn = $.db.getConnection("hana_hello::anonuser");
sql = 'SET SCHEMA qmtool';
conn.prepareStatement(sql).execute();
conn.commit();

function getIncidentSet(thekey) {
	let keyString = "'" + thekey + "'";
	var query = "SELECT KEY,MS,SA,SM,FC_EA_IC_FIM,DSM,PCM,RTC,LOD_ANA_PL,NW FROM INCIDENTS WHERE KEY=" + keyString;
	var oStatement = conn.prepareStatement(query);
	oStatement.execute();
	var incidentSet = oStatement.getResultSet();
	var incidents = {};
	while (incidentSet.next()) {
		// 		incidents.key = incidentSet.getString(1);
		incidents.MS = incidentSet.getInteger(2);
		incidents.SA = incidentSet.getInteger(3);
		incidents.SM = incidentSet.getInteger(4);
		incidents.FC_EA_IC_FIM = incidentSet.getInteger(5);
		incidents.DSM = incidentSet.getInteger(6);
		incidents.RTC = incidentSet.getInteger(7);
		incidents.LOD_ANA_PL = incidentSet.getInteger(8);
		incidents.NW = incidentSet.getInteger(9);
	}
	return incidents;
}

function getRoleSet(thekey) {
	let keyString = "'" + thekey + "'";
	var query = "SELECT KEY,MS,SA,SM,FC_EA_IC_FIM,DSM,PCM,RTC,LOD_ANA_PL,NW FROM ROLE WHERE KEY=" + keyString;
	var oStatement = conn.prepareStatement(query);
	oStatement.execute();
	var recordSet = oStatement.getResultSet();
	var record = {};
	while (recordSet.next()) {
		// 		incidents.key = incidentSet.getString(1);
		record.MS = JSON.parse(recordSet.getString(2));
		record.SA = JSON.parse(recordSet.getString(3));
		record.SM = JSON.parse(recordSet.getString(4));
		record.FC_EA_IC_FIM = JSON.parse(recordSet.getString(5));
		record.DSM = JSON.parse(recordSet.getString(6));
		record.RTC = JSON.parse(recordSet.getString(7));
		record.LOD_ANA_PL = JSON.parse(recordSet.getString(8));
		record.NW = JSON.parse(recordSet.getString(9));
	}
	return record;
}

function get() {
	$.response.setBody("GET REQUEST");
	try {
		var query, oStatement;
		// GET USER TABLE INFO
		query = 'SELECT INUMBER, NAME, KEY, ISAVAILABLE, USAGEPERCENT, CURRENTQDAYS FROM USER';
		oStatement = conn.prepareStatement(query);
		oStatement.execute();
		var userSet = oStatement.getResultSet();
		// GET INCIDENT TABLE INFO
		// 		query = 'SELECT "key",MS,SA,SM,FC_EA_IC_FIM,DSM,PCM,RTC,LOD_ANA_PL,NW FROM INCIDENTS';
		// 		oStatement = conn.prepareStatement(query);
		// 		oStatement.execute();
		// 		var incidentSet = oStatement.getResultSet();

		var result = {
			records: []
		};
		while (userSet.next()) {
			var record = {};
			// Pull users
			record.iNumber = userSet.getString(1);
			record.name = userSet.getString(2);
			record.key = userSet.getString(3);
			record.isAvailable = JSON.parse(userSet.getString(4));
			record.usagePercent = userSet.getFloat(5);
			record.currentQDays = userSet.getInteger(6);

			// Consolidate
            record.incidents = getIncidentSet(record.key);
            record.role = getRoleSet(record.key);
			result.records.push(record);
		}
		let body = JSON.stringify(result);
		$.response.contentType = 'application/json';
		$.response.setBody(body);
		$.response.status = $.net.http.OK;

	} catch (errorObj) {
		$.response.setBody(JSON.stringify({
			ERROR: errorObj.message
		}));
	}

}

function post() {

	var d = JSON.parse($.request.body.asString()); // Object
	// $.response.setBody(JSON.stringify(d)); //test
	try {
		// ADD USER // ---------------------------
		// FORM THE SQL
		sql = 'INSERT INTO USER(INUMBER, NAME, KEY, ISAVAILABLE, USAGEPERCENT, CURRENTQDAYS) VALUES ' +
			"('" + d.iNumber + "' ,'" + d.name + "','" + d.key + "','" + d.isAvailable + "'," + d.usagePercent + "," + d.currentQDays +
			");";

		// PREPARE
		conn.prepareStatement(sql).execute();
		// ADD ROLE // ---------------------------        
		// FORM THE SQL
		sql = 'INSERT INTO ROLE(KEY,MS,SA,SM,FC_EA_IC_FIM,DSM,PCM,RTC,LOD_ANA_PL,NW) VALUES ' +
			"('" + d.key + "','" + d.role.MS + "','" + d.role.SA + "','" + d.role.SM + "','" + d.role.FC_EA_IC_FIM + "','" + d.role.DSM + "','" + d.role
			.PCM + "','" + d.role.RTC + "','" + d.role.LOD_ANA_PL + "','" + d.role.NW +
			"');";

		// PREPARE
		conn.prepareStatement(sql).execute();

		// ADD INCIDENTS //  ---------------------------     
		// FORM THE SQL
		sql = 'INSERT INTO INCIDENTS(KEY,MS,SA,SM,FC_EA_IC_FIM,DSM,PCM,RTC,LOD_ANA_PL,NW) VALUES ' +
			"('" + d.key + "'," + d.incidents.MS + "," + d.incidents.SA + "," + d.incidents.SM + "," + d.incidents.FC_EA_IC_FIM + "," + d.incidents.DSM +
			"," + d.incidents.PCM + "," + d.incidents.RTC + "," + d.incidents.LOD_ANA_PL + "," + d.incidents.NW +
			");";
		// PREPARE
		conn.prepareStatement(sql).execute();

		$.response.setBody(JSON.stringify(d)); // test
		$.response.contentType = "application/json";
		$.response.status = $.net.http.OK;

	} catch (errorObj) {
		$.response.setBody(JSON.stringify({
			ERROR: errorObj.message
		}));
	}

	conn.commit();
	conn.close();
}

function put() {

}

function delet() {

}

switch (METHOD) {
	case $.net.http.GET:
		get();
		break;
	case $.net.http.POST:
		post();
		break;
	case $.net.http.PUT:
		put();
		break;
	case $.net.http.DELETE:
		delet();
		break;
}

// let id = $.request.parameters.get('id');

// let lname = $.request.parameters.get('lastname');

// let fname = $.request.parameters.get('firstname');

// var cmd = $.request.parameters.get('cmd');
// if(cmd){
//     $.response.setBody(cmd);
// } else {
//     $.response.setBody("TEST");
// }

// if(false){
//   try{
//     sql = 'SET SCHEMA qmtool';
//     conn.prepareStatement(sql).execute();
//     sql = "INSERT INTO PERSONS (ID, LASTNAME, FIRSTNAME) VALUES (5, 'IAMHUNGRY', 'nvm')";
//     conn.prepareStatement(sql).execute();
//     conn.commit();
// } catch(errorObj){

//     $.response.setBody(JSON.stringify({
//         ERROR : errorObj.message

//     }));
// }  
// }