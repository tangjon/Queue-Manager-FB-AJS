var sql;
var param;
var METHOD = $.request.method;

var conn = $.db.getConnection("hana_hello::anonuser");
sql = 'SET SCHEMA qmtool';
conn.prepareStatement(sql).execute();
conn.commit();

function get(){
    $.response.setBody("GET REQUEST");
}

function post() {
 
    var d = JSON.parse($.request.body.asString()); // Object
    // $.response.setBody(JSON.stringify(d)); //test
    try{
        // ADD USER // ---------------------------
        // FORM THE SQL
        sql = 'INSERT INTO USER("iNumber", "name", "key", "isAvailable", "usagePercent", "currentQDays") VALUES ' + 
        "('" 
        + d.iNumber + "' ,'"
        + d.name + "','" 
        + d.key + "','" 
        + d.isAvailable + "'," 
        + d.usagePercent + "," 
        + d.currentQDays + 
        ");";
        
        $.response.setBody(sql); // test
        // PREPARE
        conn.prepareStatement(sql).execute();     
        // ADD ROLE // ---------------------------        
        // FORM THE SQL
        sql = 'INSERT INTO ROLE("key",MS,SA,SM,FC_EA_IC_FIM,DSM,PCM,RTC,LOD_ANA_PL,NW) VALUES ' + 
        "('" 
        + d.key + "','"
        + d.role.MS + "','" 
        + d.role.SA + "','" 
        + d.role.SM + "','" 
        + d.role.FC_EA_IC_FIM + "','" 
        + d.role.DSM + "','" 
        + d.role.PCM + "','" 
        + d.role.RTC + "','" 
        + d.role.LOD_ANA_PL + "','" 
        + d.role.NW +
        "');";
        
        // PREPARE
        conn.prepareStatement(sql).execute();  


        // ADD INCIDENTS //  ---------------------------     
        // FORM THE SQL
        sql = 'INSERT INTO INCIDENTS("key",MS,SA,SM,FC_EA_IC_FIM,DSM,PCM,RTC,LOD_ANA_PL,NW) VALUES ' + 
        "('" 
        + d.key + "',"
        + d.incidents.MS + "," 
        + d.incidents.SA + "," 
        + d.incidents.SM + "," 
        + d.incidents.FC_EA_IC_FIM + "," 
        + d.incidents.DSM + "," 
        + d.incidents.PCM + "," 
        + d.incidents.RTC + "," 
        + d.incidents.LOD_ANA_PL + "," 
        + d.incidents.NW +
        ");";
        // PREPARE
        conn.prepareStatement(sql).execute();  

    } catch(errorObj){ $.response.setBody(JSON.stringify({ ERROR : errorObj.message }));}   

    // COMMIT
    conn.commit();
    conn.close();
}

function put(){
    
}

function delet(){
    
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



