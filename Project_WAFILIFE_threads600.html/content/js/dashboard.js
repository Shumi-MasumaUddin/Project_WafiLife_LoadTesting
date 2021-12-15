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

    var data = {"OkPercent": 99.99122807017544, "KoPercent": 0.008771929824561403};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3620614035087719, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8475, 500, 1500, "package-0"], "isController": false}, {"data": [0.22166666666666668, 500, 1500, "package"], "isController": false}, {"data": [0.28833333333333333, 500, 1500, "package-1"], "isController": false}, {"data": [0.42083333333333334, 500, 1500, "panjabi"], "isController": false}, {"data": [0.285, 500, 1500, "publisher-1"], "isController": false}, {"data": [0.004166666666666667, 500, 1500, "book-1"], "isController": false}, {"data": [0.23833333333333334, 500, 1500, "writer-1"], "isController": false}, {"data": [8.333333333333334E-4, 500, 1500, "book"], "isController": false}, {"data": [0.3075, 500, 1500, "book-0"], "isController": false}, {"data": [0.6241666666666666, 500, 1500, "writer-0"], "isController": false}, {"data": [0.9075, 500, 1500, "panjabi-0"], "isController": false}, {"data": [0.49083333333333334, 500, 1500, "panjabi-1"], "isController": false}, {"data": [0.0025, 500, 1500, "home"], "isController": false}, {"data": [0.7658333333333334, 500, 1500, "preorder-0"], "isController": false}, {"data": [0.275, 500, 1500, "preorder-1"], "isController": false}, {"data": [0.175, 500, 1500, "publisher"], "isController": false}, {"data": [0.6883333333333334, 500, 1500, "publisher-0"], "isController": false}, {"data": [0.14666666666666667, 500, 1500, "writer"], "isController": false}, {"data": [0.18916666666666668, 500, 1500, "preorder"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 11400, 1, 0.008771929824561403, 3095.17912280702, 9, 201417, 1466.0, 8123.999999999996, 14618.949999999999, 26368.809999999998, 54.098430670962905, 10988.899130487847, 9.97329056818775], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["package-0", 600, 0, 0.0, 374.87833333333344, 12, 1915, 230.0, 1042.6999999999998, 1192.6999999999996, 1586.6300000000003, 3.022928915826544, 2.344560837703985, 0.5904158038723719], "isController": false}, {"data": ["package", 600, 0, 0.0, 2011.9983333333325, 342, 13541, 1841.5, 3446.9, 4164.75, 6848.830000000001, 3.003198406302712, 528.1876663490367, 1.173124377461997], "isController": false}, {"data": ["package-1", 600, 0, 0.0, 1637.046666666667, 305, 12701, 1547.0, 2728.899999999999, 3178.6499999999996, 6094.620000000003, 3.0126228899087173, 527.5086303015886, 0.5884029081852964], "isController": false}, {"data": ["panjabi", 600, 0, 0.0, 1329.0316666666665, 305, 6502, 1090.0, 2621.8, 3167.499999999999, 4364.1900000000005, 3.0588523186100574, 371.2894986254283, 0.8125076471307966], "isController": false}, {"data": ["publisher-1", 600, 0, 0.0, 1607.9733333333336, 289, 7745, 1548.0, 2516.3999999999996, 3101.549999999995, 4977.770000000007, 2.977475398609519, 252.79190657054383, 0.40416902383469056], "isController": false}, {"data": ["book-1", 600, 0, 0.0, 13509.596666666646, 665, 36277, 11826.0, 24311.299999999992, 29538.499999999993, 34405.45, 2.971591584452633, 3344.1490899732926, 0.3743508929632711], "isController": false}, {"data": ["writer-1", 600, 0, 0.0, 1766.7199999999993, 300, 10615, 1687.0, 2814.7999999999997, 3412.2999999999975, 5449.300000000007, 2.983931528717854, 250.19611676279484, 0.39630340615784004], "isController": false}, {"data": ["book", 600, 0, 0.0, 15202.005000000001, 708, 38303, 13778.0, 25652.0, 30963.899999999994, 35047.33, 2.968210465910103, 3342.4408810158825, 0.7478499025437564], "isController": false}, {"data": ["book-0", 600, 0, 0.0, 1692.4049999999982, 21, 9151, 1643.0, 2856.2999999999997, 3289.4499999999994, 4418.690000000003, 2.9961649089165867, 2.1165583833942554, 0.3774465559084372], "isController": false}, {"data": ["writer-0", 600, 0, 0.0, 782.6200000000001, 11, 3864, 837.5, 1324.9, 1511.0, 2280.1400000000017, 2.9973623211573814, 2.1369085829470067, 0.39808718327871473], "isController": false}, {"data": ["panjabi-0", 600, 0, 0.0, 263.83999999999986, 11, 1790, 144.0, 715.8, 1138.0, 1557.9, 3.0633970009343363, 2.1845550703049614, 0.40685741418659155], "isController": false}, {"data": ["panjabi-1", 600, 0, 0.0, 1065.143333333333, 291, 5060, 913.0, 1959.3999999999999, 2316.549999999995, 3281.8100000000004, 3.0673121654712667, 370.1290244094146, 0.40737739697665265], "isController": false}, {"data": ["home", 600, 1, 0.16666666666666666, 7814.016666666664, 1169, 201417, 5380.0, 15300.999999999998, 23163.599999999988, 34254.830000000016, 2.9529593574360438, 1290.7633882486366, 0.34259423170149517], "isController": false}, {"data": ["preorder-0", 600, 0, 0.0, 511.85333333333347, 10, 2724, 395.0, 1136.9, 1302.85, 1596.88, 2.997946406711403, 2.1109758565382712, 0.37181561880112124], "isController": false}, {"data": ["preorder-1", 600, 0, 0.0, 1633.4866666666653, 296, 12577, 1584.5, 2595.6, 3102.949999999997, 4995.6900000000005, 2.9875121990081457, 349.36544832444133, 0.37052153249417435], "isController": false}, {"data": ["publisher", 600, 0, 0.0, 2259.4850000000006, 304, 8011, 2327.0, 3597.4999999999995, 4215.75, 6034.220000000003, 2.9750984261729325, 254.71985032155854, 0.8076927367930422], "isController": false}, {"data": ["publisher-0", 600, 0, 0.0, 651.4299999999998, 9, 4029, 660.0, 1200.0, 1404.6999999999996, 1674.6700000000003, 2.994714329208946, 2.1437943280110603, 0.4065090739844175], "isController": false}, {"data": ["writer", 600, 0, 0.0, 2549.4600000000023, 317, 11720, 2622.0, 3996.399999999999, 4470.449999999998, 6582.060000000001, 2.977948292891141, 251.81750330211037, 0.7910175152992094], "isController": false}, {"data": ["preorder", 600, 0, 0.0, 2145.413333333332, 320, 13662, 2115.0, 3517.3999999999996, 4127.0999999999985, 6536.150000000008, 2.9784213374104613, 350.39957286800876, 0.7387881051779854], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.wafilife.com:443 failed to respond", 1, 100.0, 0.008771929824561403], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 11400, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.wafilife.com:443 failed to respond", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["home", 600, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.wafilife.com:443 failed to respond", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
