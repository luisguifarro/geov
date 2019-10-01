

        var configpie = {
        type: 'pie',
        data: {
            datasets: [{
                data: [
                    '156.23','123.123'
                ],
                backgroundColor: [
                    
                    "#0B3B0B", "#fd8d3c"
                    
                ],
                label: 'Dataset 1'
            }],
            labels: [                
                "2013",
                "2001"
            ]
        },
        options: {
            responsive: true
        }
    };

        function get_chart_piesimple(nameind, dato2013, dato2001) {
                
                var newDataset = {
                     backgroundColor: [ "#0B3B0B", "#fd8d3c"],
                     data: [ dato2013, dato2001],
                     label: 'New datos'
                };
                configpie.data.datasets.splice(0, 1);
              
                window.myPie.update(); 
                configpie.data.datasets.push(newDataset);

                window.myPie.update();

                pie_chart('robots/itg_inputarticulo.php?param='+nameind+'&accion=makechartpie'); // enviamos consulta      
            }

            var anos=["#0B3B0B", "#fd8d3c"];          
           
            var config = {
                type: 'line',
                data: {
                    labels: ['FM','San Lorenzo'],
                    datasets: [{
                        label: "Año 2013",
                        data: ['156.23','123.123'],
                        fill: false
                    },
                    {
                        label: "Año 2001",
                        data: ['126.23','163.123'],
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    title:{
                        display:false,
                        text:'Titulo de indicador'
                    },
                    tooltips: {
                        mode: 'label'
                    },
                    hover: {
                        mode: 'dataset'
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: ''
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: ''
                            }
                        }],
                    },
                    legend:{
                     position:'bottom'
                    }
                }
            };

            $.each(config.data.datasets, function(i, dataset) {
                dataset.borderColor = anos[i];
                dataset.backgroundColor = anos[i];
                dataset.pointBorderColor = anos[i];
                dataset.pointBackgroundColor = anos[i];
                dataset.pointBorderWidth = 2;
            });

    
            function startgra_init() {
                var ctx = document.getElementById("canvas").getContext("2d");
                window.myLine = new Chart(ctx, config);
                var ctxpie = document.getElementById("chart-area").getContext("2d");
                window.myPie = new Chart(ctxpie, configpie);
            }
     
    function get_chart_line(nameind, id_indicador, tipocapa) {

        config.data.labels=[];
        config.data.datasets[0].data=[];
        config.data.datasets[1].data=[];
        window.myLine.update();

        str = id_indicador+";"+tipocapa;
        //alert(str);
        var newLabels = [ ], temperature=[], humidity=[];

        line_chart('robots/itg_inputarticulo.php?accion=makechartlinebefore'); // enviamos consulta    
               
       $.get('vendor/graficoline.php?param='+str+' ', function(dataGet) {
                data = JSON.parse(dataGet);
                //alert(data['labels']);
                data['labels'].forEach(function(singleResult) {
                    newLabels.push(singleResult);
                });
                //alert(newLabels);

                //alert(data['temperature']);
                data['temperature'].forEach(function(singleResult) {
                    temperature.push(singleResult);
                });
                //alert(temperature[0]);

                //alert(data['humidity']);
                data['humidity'].forEach(function(singleResult) {
                    humidity.push(singleResult);
                });
                //alert(humidity[0]);                                             
            }).complete(function(data) {
                //alert(config.data.labels);
                
                newLabels.forEach(function(singleResult) {
                    config.data.labels.push(singleResult);
                });
                //alert(config.data.labels);

                //alert(config.data.datasets[0].data);
                
                temperature.forEach(function(singleResult) {
                    config.data.datasets[0].data.push(singleResult);
                });
                //alert(config.data.datasets[0].data);

                //alert(config.data.datasets[1].data);
                
                humidity.forEach(function(singleResult) {
                    config.data.datasets[1].data.push(singleResult);
                });

                window.myLine.update(); 
                line_chart('robots/itg_inputarticulo.php?param='+nameind+'&accion=makechartline'); // enviamos consulta      
            });
        
    };

