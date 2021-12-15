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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4416374269005848, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.86, 500, 1500, "package-0"], "isController": false}, {"data": [0.3377777777777778, 500, 1500, "package"], "isController": false}, {"data": [0.4477777777777778, 500, 1500, "package-1"], "isController": false}, {"data": [0.49777777777777776, 500, 1500, "panjabi"], "isController": false}, {"data": [0.43555555555555553, 500, 1500, "publisher-1"], "isController": false}, {"data": [0.024444444444444446, 500, 1500, "book-1"], "isController": false}, {"data": [0.3477777777777778, 500, 1500, "writer-1"], "isController": false}, {"data": [0.022222222222222223, 500, 1500, "book"], "isController": false}, {"data": [0.5255555555555556, 500, 1500, "book-0"], "isController": false}, {"data": [0.6744444444444444, 500, 1500, "writer-0"], "isController": false}, {"data": [0.9055555555555556, 500, 1500, "panjabi-0"], "isController": false}, {"data": [0.6088888888888889, 500, 1500, "panjabi-1"], "isController": false}, {"data": [0.014444444444444444, 500, 1500, "home"], "isController": false}, {"data": [0.7944444444444444, 500, 1500, "preorder-0"], "isController": false}, {"data": [0.4477777777777778, 500, 1500, "preorder-1"], "isController": false}, {"data": [0.25, 500, 1500, "publisher"], "isController": false}, {"data": [0.7422222222222222, 500, 1500, "publisher-0"], "isController": false}, {"data": [0.16333333333333333, 500, 1500, "writer"], "isController": false}, {"data": [0.2911111111111111, 500, 1500, "preorder"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8550, 0, 0.0, 1896.1869005847984, 9, 32016, 1027.0, 4530.800000000001, 7083.899999999996, 13188.799999999996, 96.36951792698459, 19579.862143334158, 17.767139227184092], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["package-0", 450, 0, 0.0, 311.78666666666663, 12, 1682, 199.0, 781.1000000000004, 870.45, 1184.7700000000016, 5.561460315890946, 4.312111083990409, 1.0862227179474504], "isController": false}, {"data": ["package", 450, 0, 0.0, 1546.9288888888896, 358, 7653, 1331.0, 2827.5000000000005, 3470.6, 5465.520000000003, 5.523844595838704, 971.503854703707, 2.1577517952494936], "isController": false}, {"data": ["package-1", 450, 0, 0.0, 1235.0422222222217, 344, 6946, 1060.5, 2107.100000000001, 2767.95, 4933.650000000002, 5.53982518773852, 970.0190984511571, 1.0819971069801797], "isController": false}, {"data": ["panjabi", 450, 0, 0.0, 1152.442222222222, 308, 9989, 869.5, 2198.9, 2656.6, 5532.670000000009, 5.499407286103609, 667.5298834545749, 1.460780060371271], "isController": false}, {"data": ["publisher-1", 450, 0, 0.0, 1307.6555555555562, 305, 31728, 1078.5, 2040.5000000000005, 2485.4499999999985, 4265.190000000002, 5.459442408948633, 463.5162927390932, 0.741076655120957], "isController": false}, {"data": ["book-1", 450, 0, 0.0, 6929.40666666667, 624, 27654, 5855.5, 12255.900000000005, 15023.949999999997, 24107.710000000006, 16.10824742268041, 18127.79821371841, 2.0292616382087627], "isController": false}, {"data": ["writer-1", 450, 0, 0.0, 1510.7755555555557, 308, 31899, 1204.0, 2292.0000000000005, 2882.0, 5616.930000000013, 8.80298910385571, 738.1086097818326, 1.1691469903558365], "isController": false}, {"data": ["book", 450, 0, 0.0, 7970.275555555557, 786, 27781, 7020.5, 13065.5, 15363.24999999999, 24310.430000000004, 16.01537475976938, 18034.595468594296, 4.035123718770019], "isController": false}, {"data": ["book-0", 450, 0, 0.0, 1040.8133333333333, 62, 3750, 1022.0, 1851.9000000000008, 2427.3999999999996, 3076.6200000000013, 22.876315388134817, 16.160468614966195, 2.8818795752630777], "isController": false}, {"data": ["writer-0", 450, 0, 0.0, 577.1355555555554, 18, 2645, 603.0, 892.0, 924.3499999999999, 2133.49, 16.46241082860801, 11.73854204774099, 2.1864139381745016], "isController": false}, {"data": ["panjabi-0", 450, 0, 0.0, 234.90000000000018, 10, 1465, 102.0, 794.0000000000003, 894.3499999999999, 1220.7400000000011, 5.591937668534788, 3.987070974115542, 0.7426792216022765], "isController": false}, {"data": ["panjabi-1", 450, 0, 0.0, 917.497777777779, 288, 9169, 736.0, 1613.5000000000002, 1972.1999999999994, 4696.820000000011, 5.519372999227287, 666.0180325390036, 0.7330417264598741], "isController": false}, {"data": ["home", 450, 0, 0.0, 3693.7022222222236, 567, 17353, 3135.0, 6333.500000000001, 7555.3499999999985, 13640.250000000007, 20.502072987379833, 8979.911794814114, 2.3825651225568363], "isController": false}, {"data": ["preorder-0", 450, 0, 0.0, 399.08222222222224, 9, 1689, 329.0, 857.8000000000001, 918.0, 1137.0900000000004, 5.490081253202548, 3.867195125112852, 0.6808987491764878], "isController": false}, {"data": ["preorder-1", 450, 0, 0.0, 1214.2733333333342, 313, 5718, 1039.0, 2179.8, 2595.35, 4295.8, 5.4715237585720535, 639.8479438849643, 0.6785971849010262], "isController": false}, {"data": ["publisher", 450, 0, 0.0, 1796.073333333334, 316, 31758, 1595.0, 2822.8, 3350.35, 4775.970000000002, 5.452628772916187, 466.84147343282365, 1.4803035145221681], "isController": false}, {"data": ["publisher-0", 450, 0, 0.0, 488.3266666666662, 10, 1646, 513.5, 894.0, 918.0, 1017.8300000000006, 8.858093344619201, 6.341725864156217, 1.2024169676778016], "isController": false}, {"data": ["writer", 450, 0, 0.0, 2088.004444444445, 331, 32016, 1909.0, 3100.2000000000003, 3694.3999999999987, 6101.940000000013, 8.794559099437148, 743.6727460583274, 2.3360547607879925], "isController": false}, {"data": ["preorder", 450, 0, 0.0, 1613.4288888888893, 333, 6155, 1463.0, 2898.2000000000007, 3277.7, 4894.870000000001, 5.465741944103679, 643.021860690384, 1.3557602087913423], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8550, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
