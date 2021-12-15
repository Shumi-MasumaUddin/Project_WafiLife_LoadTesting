/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.94499449944995, "KoPercent": 0.05500550055005501};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4442794279427943, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9339019189765458, 500, 1500, "package-0"], "isController": false}, {"data": [0.3784648187633262, 500, 1500, "package"], "isController": false}, {"data": [0.4690831556503198, 500, 1500, "package-1"], "isController": false}, {"data": [0.5255863539445629, 500, 1500, "panjabi"], "isController": false}, {"data": [0.4051172707889126, 500, 1500, "publisher-1"], "isController": false}, {"data": [0.007478632478632479, 500, 1500, "book-1"], "isController": false}, {"data": [0.1908315565031983, 500, 1500, "writer-1"], "isController": false}, {"data": [0.006396588486140725, 500, 1500, "book"], "isController": false}, {"data": [0.21367521367521367, 500, 1500, "book-0"], "isController": false}, {"data": [0.8070362473347548, 500, 1500, "writer-0"], "isController": false}, {"data": [0.9658848614072495, 500, 1500, "panjabi-0"], "isController": false}, {"data": [0.6332622601279317, 500, 1500, "panjabi-1"], "isController": false}, {"data": [0.002307692307692308, 500, 1500, "home"], "isController": false}, {"data": [0.906183368869936, 500, 1500, "preorder-0"], "isController": false}, {"data": [0.47867803837953093, 500, 1500, "preorder-1"], "isController": false}, {"data": [0.31130063965884863, 500, 1500, "publisher"], "isController": false}, {"data": [0.8742004264392325, 500, 1500, "publisher-0"], "isController": false}, {"data": [0.13432835820895522, 500, 1500, "writer"], "isController": false}, {"data": [0.36673773987206826, 500, 1500, "preorder"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9090, 5, 0.05500550055005501, 7009.120572057184, 10, 81532, 1234.5, 15562.20000000001, 61951.04999999992, 72866.70000000001, 86.4249177584666, 17921.09944533018, 15.809025830021488], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["package-0", 469, 0, 0.0, 555.5394456289972, 10, 48110, 105.0, 435.0, 1485.5, 13576.300000000032, 5.159856536185007, 4.002558956036702, 1.0077844797236342], "isController": false}, {"data": ["package", 469, 1, 0.21321961620469082, 2594.68869936034, 303, 63544, 1050.0, 3357.0, 5281.0, 48953.50000000004, 4.846142718386409, 850.5446259738783, 1.891006349583583], "isController": false}, {"data": ["package-1", 469, 1, 0.21321961620469082, 2030.6737739872074, 288, 53658, 904.0, 2653.0, 4302.5, 29495.400000000005, 4.869843313570145, 850.9267158020705, 0.9491132524115589], "isController": false}, {"data": ["panjabi", 469, 0, 0.0, 1387.8955223880596, 297, 57457, 718.0, 1868.0, 2725.5, 22277.500000000062, 4.888268156424581, 593.3496606744559, 1.2984462290502794], "isController": false}, {"data": ["publisher-1", 469, 0, 0.0, 2404.686567164179, 288, 47874, 1432.0, 3860.0, 6316.5, 25188.300000000014, 5.177057576827976, 439.54027958111647, 0.7027451202920788], "isController": false}, {"data": ["book-1", 468, 1, 0.21367521367521367, 46326.305555555526, 602, 81139, 58760.5, 70832.3, 74428.59999999999, 79908.95, 5.170756499353655, 5806.63392461316, 0.6500022615154294], "isController": false}, {"data": ["writer-1", 469, 0, 0.0, 3812.081023454157, 294, 59747, 1814.0, 7515.0, 16118.0, 40739.10000000004, 5.196215293935163, 435.688785897095, 0.690122343725764], "isController": false}, {"data": ["book", 469, 2, 0.42643923240938164, 48645.473347547944, 639, 81532, 61989.0, 73285.0, 76431.5, 80795.3, 5.1656533615296505, 5792.196778161209, 1.2973399191283372], "isController": false}, {"data": ["book-0", 468, 0, 0.0, 2303.626068376071, 37, 20286, 2448.0, 3450.4, 3992.2, 11719.260000000002, 5.481377371749825, 3.870380944014992, 0.6905250790583275], "isController": false}, {"data": ["writer-0", 469, 0, 0.0, 1119.7675906183354, 28, 21904, 113.0, 1784.0, 7703.0, 20456.0, 5.248550773293942, 3.742997793985989, 0.6970731495781015], "isController": false}, {"data": ["panjabi-0", 469, 0, 0.0, 351.70788912579883, 11, 24482, 95.0, 325.0, 483.5, 10073.900000000043, 4.913515835350075, 3.503392774826875, 0.6525763218824319], "isController": false}, {"data": ["panjabi-1", 469, 0, 0.0, 1036.144989339019, 281, 32976, 599.0, 1732.0, 2453.0, 10211.50000000001, 4.918049977454569, 593.4580235521114, 0.6531785126306848], "isController": false}, {"data": ["home", 650, 0, 0.0, 7117.693846153838, 1047, 66645, 5621.0, 12453.499999999998, 16189.89999999999, 43049.44000000008, 8.626410086264102, 3778.02037108079, 1.002483203384207], "isController": false}, {"data": ["preorder-0", 469, 0, 0.0, 401.5117270788917, 11, 25409, 105.0, 652.0, 1541.0, 8939.1, 5.21928799563761, 3.6749523037480945, 0.6473140385214614], "isController": false}, {"data": ["preorder-1", 469, 0, 0.0, 2015.2025586353977, 284, 53553, 1033.0, 2886.0, 4398.5, 31746.40000000002, 5.1196402060955375, 598.699694793304, 0.634955377123177], "isController": false}, {"data": ["publisher", 469, 0, 0.0, 3079.0127931769744, 320, 63737, 1529.0, 5172.0, 12341.0, 31832.4, 5.155035777487113, 441.3606737200343, 1.3995116661537277], "isController": false}, {"data": ["publisher-0", 469, 0, 0.0, 616.4818763326228, 15, 24083, 92.0, 1331.0, 2291.5, 12510.400000000005, 5.221263568048984, 3.7374865189256887, 0.7087457382410242], "isController": false}, {"data": ["writer", 469, 0, 0.0, 4946.11513859275, 372, 61533, 2015.0, 11288.0, 27323.0, 51038.10000000004, 5.165824053574773, 436.82456282561765, 1.372172014230799], "isController": false}, {"data": ["preorder", 469, 0, 0.0, 2460.579957356075, 297, 57459, 1295.0, 3682.0, 5090.5, 51965.40000000004, 5.09516773857118, 599.4253995707403, 1.2638404351533983], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.wafilife.com:80 failed to respond", 1, 20.0, 0.011001100110011002], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 4, 80.0, 0.04400440044004401], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 9090, 5, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.wafilife.com:80 failed to respond", 1, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["package", 469, 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["package-1", 469, 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["book-1", 468, 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["book", 469, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.wafilife.com:80 failed to respond", 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
