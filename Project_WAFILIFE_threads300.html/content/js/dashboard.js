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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5442982456140351, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9816666666666667, 500, 1500, "package-0"], "isController": false}, {"data": [0.4033333333333333, 500, 1500, "package"], "isController": false}, {"data": [0.515, 500, 1500, "package-1"], "isController": false}, {"data": [0.5766666666666667, 500, 1500, "panjabi"], "isController": false}, {"data": [0.49833333333333335, 500, 1500, "publisher-1"], "isController": false}, {"data": [0.03166666666666667, 500, 1500, "book-1"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "writer-1"], "isController": false}, {"data": [0.025, 500, 1500, "book"], "isController": false}, {"data": [0.6833333333333333, 500, 1500, "book-0"], "isController": false}, {"data": [0.975, 500, 1500, "writer-0"], "isController": false}, {"data": [0.985, 500, 1500, "panjabi-0"], "isController": false}, {"data": [0.6633333333333333, 500, 1500, "panjabi-1"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "home"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "preorder-0"], "isController": false}, {"data": [0.5, 500, 1500, "preorder-1"], "isController": false}, {"data": [0.365, 500, 1500, "publisher"], "isController": false}, {"data": [0.9716666666666667, 500, 1500, "publisher-0"], "isController": false}, {"data": [0.335, 500, 1500, "writer"], "isController": false}, {"data": [0.39, 500, 1500, "preorder"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5700, 0, 0.0, 1397.1522807017527, 10, 19473, 775.0, 3227.800000000001, 4727.9, 10377.399999999987, 194.48614712706427, 39514.50249292002, 35.856384135730856], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["package-0", 300, 0, 0.0, 194.1733333333335, 11, 1232, 117.5, 443.50000000000017, 467.9, 1015.3700000000015, 12.489072061945798, 9.686592590857998, 2.4392718870987884], "isController": false}, {"data": ["package", 300, 0, 0.0, 1255.240000000001, 328, 4960, 984.5, 2339.5000000000027, 2908.2, 4208.850000000003, 12.307187397440106, 2164.5248207765835, 4.807495077125041], "isController": false}, {"data": ["package-1", 300, 0, 0.0, 1061.0033333333333, 297, 4526, 811.5, 2036.9, 2496.2499999999995, 3761.680000000002, 12.35941169200346, 2164.123733804021, 2.413947596094426], "isController": false}, {"data": ["panjabi", 300, 0, 0.0, 965.8699999999999, 300, 5291, 705.5, 1847.8000000000004, 2239.95, 3131.370000000001, 12.848515996402416, 1559.5839054938112, 3.412887061544392], "isController": false}, {"data": ["publisher-1", 300, 0, 0.0, 1056.9199999999992, 328, 4173, 867.0, 1812.9000000000003, 2285.9, 3624.3400000000015, 12.658227848101266, 1074.703899657173, 1.7182555379746836], "isController": false}, {"data": ["book-1", 300, 0, 0.0, 4784.326666666669, 508, 19402, 3703.0, 9456.600000000008, 12585.849999999999, 18088.020000000008, 13.753896937465615, 15478.288139484572, 1.7326686571611956], "isController": false}, {"data": ["writer-1", 300, 0, 0.0, 1159.6233333333332, 305, 4400, 871.5, 2040.6000000000001, 2682.249999999998, 3550.0700000000015, 13.262013173599753, 1111.9849227487734, 1.7613611246187173], "isController": false}, {"data": ["book", 300, 0, 0.0, 5486.229999999998, 638, 19473, 4530.0, 10162.2, 13097.599999999999, 18140.420000000002, 13.658714259697687, 15380.814246110112, 3.441355741212894], "isController": false}, {"data": ["book-0", 300, 0, 0.0, 701.8266666666667, 18, 5615, 644.0, 1707.8000000000002, 1866.3999999999999, 3791.7700000000013, 18.681113394358302, 13.187820108661809, 2.353382449093966], "isController": false}, {"data": ["writer-0", 300, 0, 0.0, 284.376666666667, 10, 1335, 304.5, 464.90000000000003, 517.3999999999996, 872.7800000000002, 14.138272303124559, 10.085485001649465, 1.8777392902587302], "isController": false}, {"data": ["panjabi-0", 300, 0, 0.0, 151.09999999999997, 10, 781, 87.5, 428.0, 458.74999999999994, 726.7700000000002, 13.027618551328818, 9.290320479416364, 1.7302305888483587], "isController": false}, {"data": ["panjabi-1", 300, 0, 0.0, 814.6900000000003, 287, 5133, 616.5, 1576.4, 1838.9499999999996, 2696.6400000000003, 12.908777969018933, 1557.693076995482, 1.714447074010327], "isController": false}, {"data": ["home", 300, 0, 0.0, 2963.326666666665, 425, 14871, 2464.0, 4799.200000000001, 6677.249999999994, 11444.810000000018, 16.440157825515126, 7200.465783065267, 1.910526153551074], "isController": false}, {"data": ["preorder-0", 300, 0, 0.0, 244.9133333333332, 11, 1461, 168.5, 455.0, 562.55, 1222.5000000000005, 12.98251687727194, 9.13948902977324, 1.6101363705210316], "isController": false}, {"data": ["preorder-1", 300, 0, 0.0, 1068.6133333333328, 296, 5134, 847.5, 1816.9000000000003, 2471.149999999999, 4057.2900000000027, 12.305168170631665, 1438.9845512458983, 1.5261292555373258], "isController": false}, {"data": ["publisher", 300, 0, 0.0, 1326.4933333333324, 344, 4538, 1243.0, 2204.5, 2569.349999999999, 4007.1100000000006, 12.649154614833243, 1082.988171722815, 3.4340478348863686], "isController": false}, {"data": ["publisher-0", 300, 0, 0.0, 269.5033333333334, 10, 2530, 236.0, 460.0, 507.74999999999994, 1328.9400000000028, 13.435442697836892, 9.617450260871513, 1.8237563818352813], "isController": false}, {"data": ["writer", 300, 0, 0.0, 1444.063333333333, 333, 4548, 1281.0, 2456.0000000000005, 2987.2, 4080.2400000000034, 13.245617908075412, 1120.0589361009315, 3.5183672568325313], "isController": false}, {"data": ["preorder", 300, 0, 0.0, 1313.6, 310, 5589, 1110.0, 2236.2000000000007, 2875.95, 4488.750000000003, 12.254901960784313, 1441.7336058772466, 3.0397901348039214], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5700, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
