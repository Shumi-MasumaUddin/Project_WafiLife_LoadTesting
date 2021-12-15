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

    var data = {"OkPercent": 95.48872180451127, "KoPercent": 4.511278195488722};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.44763157894736844, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8814285714285715, 500, 1500, "package-0"], "isController": false}, {"data": [0.3171428571428571, 500, 1500, "package"], "isController": false}, {"data": [0.3757142857142857, 500, 1500, "package-1"], "isController": false}, {"data": [0.48857142857142855, 500, 1500, "panjabi"], "isController": false}, {"data": [0.36, 500, 1500, "publisher-1"], "isController": false}, {"data": [0.095, 500, 1500, "book-1"], "isController": false}, {"data": [0.3221428571428571, 500, 1500, "writer-1"], "isController": false}, {"data": [0.09428571428571429, 500, 1500, "book"], "isController": false}, {"data": [0.6671428571428571, 500, 1500, "book-0"], "isController": false}, {"data": [0.7307142857142858, 500, 1500, "writer-0"], "isController": false}, {"data": [0.9328571428571428, 500, 1500, "panjabi-0"], "isController": false}, {"data": [0.5657142857142857, 500, 1500, "panjabi-1"], "isController": false}, {"data": [0.0, 500, 1500, "home"], "isController": false}, {"data": [0.8135714285714286, 500, 1500, "preorder-0"], "isController": false}, {"data": [0.37357142857142855, 500, 1500, "preorder-1"], "isController": false}, {"data": [0.24357142857142858, 500, 1500, "publisher"], "isController": false}, {"data": [0.7678571428571429, 500, 1500, "publisher-0"], "isController": false}, {"data": [0.20714285714285716, 500, 1500, "writer"], "isController": false}, {"data": [0.26857142857142857, 500, 1500, "preorder"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 13300, 600, 4.511278195488722, 2748.312781954894, 9, 61796, 1086.0, 5453.5999999999985, 12690.0, 29311.869999999974, 205.95887016848366, 37809.08696124528, 37.9715495114284], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["package-0", 700, 0, 0.0, 338.84857142857123, 10, 2611, 243.0, 909.1999999999998, 1062.85, 1682.3500000000006, 12.675418741511997, 9.825995925758262, 2.475667722951562], "isController": false}, {"data": ["package", 700, 0, 0.0, 1951.654285714286, 294, 14129, 1720.5, 3643.899999999999, 4724.499999999998, 7759.42, 12.607614999459674, 2217.3614210639475, 4.924849609163935], "isController": false}, {"data": ["package-1", 700, 0, 0.0, 1612.7385714285708, 283, 13230, 1377.0, 2807.7999999999997, 4125.299999999997, 7267.670000000001, 12.654337726196287, 2215.769116100159, 2.471550337147712], "isController": false}, {"data": ["panjabi", 700, 0, 0.0, 1241.2700000000007, 294, 14455, 971.0, 2375.8, 3192.4999999999964, 4956.330000000003, 12.706710958630579, 1542.3687266287282, 3.3752200983862477], "isController": false}, {"data": ["publisher-1", 700, 0, 0.0, 1630.70714285714, 276, 13109, 1395.0, 2787.0, 3676.5999999999995, 8455.090000000006, 12.092107308815146, 1026.6405757408575, 1.641409097583306], "isController": false}, {"data": ["book-1", 700, 0, 0.0, 10399.29142857143, 383, 41158, 9506.0, 21425.199999999997, 25676.199999999997, 32045.920000000006, 11.65268344653083, 13113.640145497278, 1.4679650044946064], "isController": false}, {"data": ["writer-1", 700, 0, 0.0, 1799.904285714287, 275, 19602, 1556.5, 2909.2999999999997, 4066.199999999999, 8673.870000000003, 11.828120511650699, 991.7584336083372, 1.5709222554536084], "isController": false}, {"data": ["book", 700, 0, 0.0, 11219.782857142854, 407, 41209, 10928.0, 22090.699999999997, 25957.649999999994, 32223.530000000006, 11.64492946499867, 13113.139246193563, 2.933976369110993], "isController": false}, {"data": ["book-0", 700, 0, 0.0, 820.3057142857147, 19, 11587, 432.0, 2131.3999999999996, 2802.5999999999967, 3679.98, 11.74851465207613, 8.298404667097445, 1.4800374903494344], "isController": false}, {"data": ["writer-0", 700, 0, 0.0, 554.902857142857, 9, 2050, 527.5, 1081.0, 1144.0, 1478.3000000000006, 11.878499915153572, 8.468833520702528, 1.5776132699813339], "isController": false}, {"data": ["panjabi-0", 700, 0, 0.0, 218.44571428571444, 9, 1868, 90.0, 645.0999999999996, 871.6999999999982, 1141.7400000000002, 12.774655084312723, 9.10746650074823, 1.6966338783852837], "isController": false}, {"data": ["panjabi-1", 700, 0, 0.0, 1022.7642857142845, 276, 12947, 736.0, 1880.6999999999998, 2421.699999999998, 4340.710000000003, 12.79380048981979, 1543.818730980645, 1.6991766275541909], "isController": false}, {"data": ["home", 700, 600, 85.71428571428571, 10360.948571428571, 326, 61796, 1991.5, 57252.299999999996, 59505.45, 60592.82, 11.229646266142616, 736.8575852751263, 1.305007720381808], "isController": false}, {"data": ["preorder-0", 700, 0, 0.0, 437.3842857142859, 11, 5532, 389.0, 945.9, 1060.8999999999999, 1889.5200000000023, 12.31007315700619, 8.670598654245216, 1.526737588808385], "isController": false}, {"data": ["preorder-1", 700, 0, 0.0, 1605.2657142857154, 278, 15552, 1403.5, 2751.099999999999, 3942.4499999999966, 7556.85, 12.270583904499798, 1434.9423330488457, 1.5218399959682367], "isController": false}, {"data": ["publisher", 700, 0, 0.0, 2118.4700000000016, 293, 13252, 2032.5, 3613.6999999999994, 4392.75, 8838.330000000002, 12.070838578400098, 1033.4767228158248, 3.277044067182839], "isController": false}, {"data": ["publisher-0", 700, 0, 0.0, 487.6828571428577, 9, 2192, 454.0, 985.9, 1081.7999999999997, 1535.8100000000002, 12.142869533540342, 8.693467895120301, 1.6482996730098705], "isController": false}, {"data": ["writer", 700, 0, 0.0, 2354.874285714284, 293, 19633, 2282.0, 3817.9999999999995, 4970.699999999992, 8967.640000000001, 11.818335303055884, 999.3639071205471, 3.1392453148742194], "isController": false}, {"data": ["preorder", 700, 0, 0.0, 2042.7014285714301, 291, 16519, 1888.0, 3589.1, 4842.249999999992, 8329.750000000002, 12.246540352350461, 1440.7564897096258, 3.037716063961931], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 600, 100.0, 4.511278195488722], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 13300, 600, "500/Internal Server Error", 600, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["home", 700, 600, "500/Internal Server Error", 600, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
