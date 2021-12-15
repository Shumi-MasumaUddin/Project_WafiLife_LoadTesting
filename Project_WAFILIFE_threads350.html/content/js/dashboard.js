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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.47398496240601506, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9057142857142857, 500, 1500, "package-0"], "isController": false}, {"data": [0.3514285714285714, 500, 1500, "package"], "isController": false}, {"data": [0.4471428571428571, 500, 1500, "package-1"], "isController": false}, {"data": [0.4685714285714286, 500, 1500, "panjabi"], "isController": false}, {"data": [0.4442857142857143, 500, 1500, "publisher-1"], "isController": false}, {"data": [0.017142857142857144, 500, 1500, "book-1"], "isController": false}, {"data": [0.4142857142857143, 500, 1500, "writer-1"], "isController": false}, {"data": [0.015714285714285715, 500, 1500, "book"], "isController": false}, {"data": [0.5885714285714285, 500, 1500, "book-0"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "writer-0"], "isController": false}, {"data": [0.9157142857142857, 500, 1500, "panjabi-0"], "isController": false}, {"data": [0.5671428571428572, 500, 1500, "panjabi-1"], "isController": false}, {"data": [0.025714285714285714, 500, 1500, "home"], "isController": false}, {"data": [0.8785714285714286, 500, 1500, "preorder-0"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "preorder-1"], "isController": false}, {"data": [0.3142857142857143, 500, 1500, "publisher"], "isController": false}, {"data": [0.8557142857142858, 500, 1500, "publisher-0"], "isController": false}, {"data": [0.25857142857142856, 500, 1500, "writer"], "isController": false}, {"data": [0.32285714285714284, 500, 1500, "preorder"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 6650, 0, 0.0, 1767.9875187970003, 9, 23798, 923.5, 4140.600000000008, 6984.349999999999, 13581.98, 193.1623435094548, 39245.526284556814, 35.61232145191274], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["package-0", 350, 0, 0.0, 228.03714285714295, 9, 1186, 113.5, 623.9000000000001, 703.45, 950.7400000000002, 13.119424244696004, 10.169164433240873, 2.5623875477921882], "isController": false}, {"data": ["package", 350, 0, 0.0, 1505.3571428571431, 306, 6826, 1184.5, 3094.100000000002, 3637.649999999999, 5262.480000000004, 12.975938901864827, 2282.1349995829164, 5.068726133540949], "isController": false}, {"data": ["package-1", 350, 0, 0.0, 1277.2685714285722, 294, 6121, 1057.5, 2572.500000000003, 3108.449999999999, 5009.580000000004, 13.051422605063951, 2285.294193049185, 2.549105977551553], "isController": false}, {"data": ["panjabi", 350, 0, 0.0, 1167.571428571428, 309, 10725, 804.5, 2080.9000000000005, 2839.549999999997, 6152.320000000006, 12.89561917394348, 1565.2919519246714, 3.425398843078737], "isController": false}, {"data": ["publisher-1", 350, 0, 0.0, 1195.5799999999995, 312, 10128, 909.5, 1960.8000000000002, 2590.199999999999, 5037.180000000009, 12.046948679998623, 1022.8051696468523, 1.6352791665232507], "isController": false}, {"data": ["book-1", 350, 0, 0.0, 6446.462857142858, 621, 23729, 5229.0, 11897.000000000011, 15819.5, 21377.96000000001, 12.650449994578379, 14236.503233488904, 1.5936602043951278], "isController": false}, {"data": ["writer-1", 350, 0, 0.0, 1272.1771428571424, 288, 13221, 987.5, 2126.1000000000004, 2766.899999999999, 5331.490000000004, 12.394206593717907, 1039.2226494719182, 1.6461055632281596], "isController": false}, {"data": ["book", 350, 0, 0.0, 7402.022857142861, 672, 23798, 6361.5, 13153.200000000017, 16354.449999999999, 21437.25000000001, 12.638116559543583, 14231.54767983363, 3.1842129612912546], "isController": false}, {"data": ["book-0", 350, 0, 0.0, 955.4714285714294, 20, 3952, 949.0, 2116.7000000000007, 2511.3999999999996, 3276.84, 13.53336942231846, 9.556356212783236, 1.7048873588662905], "isController": false}, {"data": ["writer-0", 350, 0, 0.0, 439.97999999999973, 11, 3603, 353.0, 756.8000000000008, 1583.4499999999998, 2179.060000000001, 12.980751400066758, 9.255449597596707, 1.7240060453213664], "isController": false}, {"data": ["panjabi-0", 350, 0, 0.0, 184.76285714285697, 10, 1430, 48.5, 581.0, 746.05, 1046.7500000000007, 13.550135501355014, 9.659159649632212, 1.7996273712737128], "isController": false}, {"data": ["panjabi-1", 350, 0, 0.0, 982.7142857142859, 285, 10040, 718.5, 1798.3000000000002, 2098.1499999999996, 5646.090000000009, 13.217522658610271, 1594.9430805678815, 1.7554522280966767], "isController": false}, {"data": ["home", 350, 0, 0.0, 3716.262857142856, 386, 21509, 3135.5, 6417.400000000001, 8197.35, 15842.800000000043, 12.507146941109205, 5477.8732727295055, 1.453467271476558], "isController": false}, {"data": ["preorder-0", 350, 0, 0.0, 295.2114285714286, 11, 1878, 151.0, 668.7, 827.8499999999997, 1578.780000000002, 12.495091214165864, 8.800393149119989, 1.549684164256899], "isController": false}, {"data": ["preorder-1", 350, 0, 0.0, 1316.1285714285714, 301, 9047, 1017.0, 2107.8000000000006, 3137.7, 7039.710000000002, 12.411347517730498, 1451.4065962987588, 1.5392979831560285], "isController": false}, {"data": ["publisher", 350, 0, 0.0, 1539.3828571428573, 330, 10237, 1361.5, 2555.9000000000005, 3188.549999999997, 5468.880000000005, 12.036591237361579, 1030.5395590093885, 3.267746449205585], "isController": false}, {"data": ["publisher-0", 350, 0, 0.0, 343.72571428571433, 12, 2643, 234.5, 636.9000000000003, 944.6999999999983, 1766.980000000001, 12.600352809878677, 9.017197794038232, 1.7103994536847031], "isController": false}, {"data": ["writer", 350, 0, 0.0, 1712.2371428571425, 323, 13705, 1544.5, 2882.100000000001, 3566.3499999999995, 5943.800000000005, 12.382805589952238, 1047.0958105762427, 3.289182734831063], "isController": false}, {"data": ["preorder", 350, 0, 0.0, 1611.4085714285723, 316, 9847, 1333.0, 2905.6000000000004, 3835.999999999999, 7571.020000000002, 12.362249222944335, 1454.3717797444547, 3.0664172877225204], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 6650, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
