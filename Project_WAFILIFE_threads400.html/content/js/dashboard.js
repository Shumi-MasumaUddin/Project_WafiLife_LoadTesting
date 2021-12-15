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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.44434210526315787, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.86125, 500, 1500, "package-0"], "isController": false}, {"data": [0.3275, 500, 1500, "package"], "isController": false}, {"data": [0.435, 500, 1500, "package-1"], "isController": false}, {"data": [0.485, 500, 1500, "panjabi"], "isController": false}, {"data": [0.43375, 500, 1500, "publisher-1"], "isController": false}, {"data": [0.02625, 500, 1500, "book-1"], "isController": false}, {"data": [0.37, 500, 1500, "writer-1"], "isController": false}, {"data": [0.0225, 500, 1500, "book"], "isController": false}, {"data": [0.4775, 500, 1500, "book-0"], "isController": false}, {"data": [0.7125, 500, 1500, "writer-0"], "isController": false}, {"data": [0.90375, 500, 1500, "panjabi-0"], "isController": false}, {"data": [0.5975, 500, 1500, "panjabi-1"], "isController": false}, {"data": [0.01625, 500, 1500, "home"], "isController": false}, {"data": [0.8375, 500, 1500, "preorder-0"], "isController": false}, {"data": [0.4325, 500, 1500, "preorder-1"], "isController": false}, {"data": [0.2625, 500, 1500, "publisher"], "isController": false}, {"data": [0.77125, 500, 1500, "publisher-0"], "isController": false}, {"data": [0.17125, 500, 1500, "writer"], "isController": false}, {"data": [0.29875, 500, 1500, "preorder"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 7600, 0, 0.0, 1913.0627631578996, 9, 27823, 1027.0, 4783.400000000003, 7661.19999999999, 12985.53999999999, 233.5802317361773, 47457.64557465347, 43.06395411377816], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["package-0", 400, 0, 0.0, 322.72500000000025, 11, 1839, 134.0, 924.4000000000002, 966.9, 1598.1500000000008, 15.46551190844417, 11.9917374294386, 3.0206077946180017], "isController": false}, {"data": ["package", 400, 0, 0.0, 1666.7000000000014, 308, 10381, 1304.5, 2939.8, 4068.7999999999993, 6028.87, 15.244483402568695, 2681.1284311997406, 5.954876329128396], "isController": false}, {"data": ["package-1", 400, 0, 0.0, 1343.8924999999992, 295, 9469, 1101.0, 2220.000000000001, 3250.35, 5640.100000000002, 15.372790161414295, 2691.774581451768, 3.00249807840123], "isController": false}, {"data": ["panjabi", 400, 0, 0.0, 1136.8150000000012, 307, 9906, 798.5, 2169.9, 2726.5499999999997, 5779.96000000001, 15.43507621068879, 1873.5514919568784, 4.09994211846421], "isController": false}, {"data": ["publisher-1", 400, 0, 0.0, 1225.8900000000003, 304, 8968, 995.0, 2148.4, 2444.45, 5744.490000000012, 14.649331624244644, 1243.7524320179455, 1.988532320087896], "isController": false}, {"data": ["book-1", 400, 0, 0.0, 7067.050000000001, 630, 27692, 6176.0, 12303.000000000002, 14434.799999999997, 19557.080000000013, 14.321518080916578, 16117.057676277747, 1.8041756176154673], "isController": false}, {"data": ["writer-1", 400, 0, 0.0, 1422.3374999999996, 316, 7589, 1215.5, 2320.900000000001, 3063.4499999999994, 5556.26, 14.546512473634447, 1219.6925046253364, 1.9319586879045747], "isController": false}, {"data": ["book", 400, 0, 0.0, 8149.277500000002, 745, 27823, 7834.5, 13216.000000000004, 14904.65, 20123.660000000014, 14.220199793807103, 16013.077619238597, 3.582823776174055], "isController": false}, {"data": ["book-0", 400, 0, 0.0, 1082.17, 38, 3984, 1290.0, 1878.0, 2038.3999999999999, 3035.82, 20.35105571101501, 14.369852613838717, 2.563756041719664], "isController": false}, {"data": ["writer-0", 400, 0, 0.0, 600.6149999999998, 21, 2724, 640.5, 965.9000000000001, 1034.8, 1772.3800000000033, 14.69021998604429, 10.47574793877851, 1.9510448418965074], "isController": false}, {"data": ["panjabi-0", 400, 0, 0.0, 232.7675000000002, 10, 1617, 79.0, 878.1000000000004, 945.4999999999999, 1120.5200000000004, 15.628662967883098, 11.142748300382902, 2.075681800421974], "isController": false}, {"data": ["panjabi-1", 400, 0, 0.0, 903.9399999999997, 286, 8936, 716.5, 1578.9, 2101.2499999999995, 5017.110000000003, 15.553913753548237, 1876.886861378174, 2.0657541703931255], "isController": false}, {"data": ["home", 400, 0, 0.0, 3604.7574999999993, 521, 18792, 3198.5, 5747.900000000001, 6704.499999999999, 13691.150000000009, 18.610710463871957, 8151.495999424232, 2.16276811054762], "isController": false}, {"data": ["preorder-0", 400, 0, 0.0, 379.0949999999997, 10, 1796, 215.5, 899.8000000000001, 952.0, 1059.88, 15.34330648254699, 10.801073432105868, 1.9029296125815114], "isController": false}, {"data": ["preorder-1", 400, 0, 0.0, 1293.3824999999993, 322, 10767, 1060.0, 2160.5000000000005, 2722.449999999999, 4888.880000000001, 15.236353940502038, 1781.763780567935, 1.8896649906677332], "isController": false}, {"data": ["publisher", 400, 0, 0.0, 1723.602500000001, 318, 9914, 1516.0, 2912.6000000000004, 3332.95, 5821.920000000005, 14.593214155417732, 1249.434584207406, 3.9618296242247353], "isController": false}, {"data": ["publisher-0", 400, 0, 0.0, 497.65249999999946, 9, 2665, 380.0, 940.0, 1019.8499999999999, 1863.1700000000008, 14.767231513272048, 10.57118901594861, 2.0045363089304833], "isController": false}, {"data": ["writer", 400, 0, 0.0, 2022.9950000000015, 341, 8512, 1974.5, 3215.2000000000025, 3840.7499999999995, 6367.180000000006, 14.500108750815631, 1226.1418340032083, 3.8515913869354024], "isController": false}, {"data": ["preorder", 400, 0, 0.0, 1672.527500000001, 336, 11403, 1363.5, 2815.2000000000003, 3358.2999999999997, 5440.75, 15.11144692104269, 1777.7948060304118, 3.748347185493011], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 7600, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
