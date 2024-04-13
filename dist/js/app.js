var app = angular.module('CitasApp', [])


app.controller('CitasController', function($scope) {


    $scope.list_Citas = JSON.parse(localStorage.getItem("list_Citas"));
    if (!$scope.list_Citas) {
        $scope.list_Citas = [];
    }

    $('#daterangepicker_LoadDate').daterangepicker({
        singleDatePicker: true,

        startDate: moment(), // Fecha y hora actual
        locale: {
            format: 'M/DD/Y'
        }
    });

    $('#daterangepicker_LoadDate').on('apply.daterangepicker', function(ev, picker) {
        // Obtener la fecha seleccionada
        $scope.LoadDate = $(this).val();

    });

    function RefreshDateRanger(data) {
        $('#daterangepicker_LoadDate').data('daterangepicker').remove();
        debugger
        $('#daterangepicker_LoadDate').daterangepicker({
            singleDatePicker: true,
            startDate: data, // Agregar 30 minutos a la fecha y hora actual
            locale: {
                format: 'M/DD/Y'
            }
        }, function(start, end, label) {
            // Manejar la acción de aplicar aquí
            $scope.LoadDate = start.format('M/DD/Y');

            // Realizar otras operaciones necesarias con la fecha y hora seleccionadas
        });
    }


    $scope.Openmodal_NewCita = function() {
        $scope.EditModal_Cita = false;
        $scope.LoadDate = $('#daterangepicker_LoadDate').val();
        $scope.NameCliente = '';
        $scope.Details = '';
        $scope.Type = 'Cita';
        var inputHora = angular.element(document.querySelector('#inputHora'));
        // Asignar el valor de la hora al campo de entrada
        inputHora[0].value = '00:00';
        $('#NewCita').modal({
            backdrop: 'static',
            keyboard: false,
            show: true
        });
    }

    $scope.Openmodal_EditCita = function(data) {
        $scope.EditModal_Cita = true;
        RefreshDateRanger(data.Fecha + ' ' + data.Hora);
        $scope.LoadDate = data.Fecha;
        $scope.NameCliente = data.ClienteName;
        $scope.Details = data.Details;
        $scope.Type = data.Type;
        $scope.Data = data;
        debugger
        var inputHora = angular.element(document.querySelector('#inputHora'));
        // Asignar el valor de la hora al campo de entrada
        inputHora[0].value = data.Hora;
        $('#NewCita').modal({
            backdrop: 'static',
            keyboard: false,
            show: true
        });
    }

    $scope.Click_search = function(data) {
        $scope.mastersearch = data;
    }

    $scope.Save_Cita = function() {
        let inputHora = document.getElementById("inputHora");
        let valorActual = inputHora.value;
        if (!$scope.EditModal_Cita) {
            $scope.list_Citas.push({
                id: $scope.list_Citas.length + 1,
                ClienteName: $scope.NameCliente,
                Details: $scope.Details,
                Fecha: $scope.LoadDate,
                Hora: valorActual,
                Status: 1,
                Type: $scope.Type
            });
        } else {
        let index = $scope.list_Citas.findIndex(x=> x.id === $scope.Data.id)
        $scope.list_Citas[index].ClienteName = $scope.NameCliente
        $scope.list_Citas[index].Details = $scope.Details
        $scope.list_Citas[index].Fecha = $scope.LoadDate
        $scope.list_Citas[index].Hora = valorActual
        $scope.list_Citas[index].Type = $scope.Type
        }


        localStorage.setItem("list_Citas", JSON.stringify($scope.list_Citas));


    }

    $scope.Cita_ChangeWorking = function(data) {
        //atendiendo
        data.Status = 2;
        localStorage.setItem("list_Citas", JSON.stringify($scope.list_Citas));
    }

    $scope.Cita_ChangeCompleted = function(data) {
        //atendido
        data.Status = 3;
        localStorage.setItem("list_Citas", JSON.stringify($scope.list_Citas));
    }

    $scope.Cita_ChangeCancel = function(data) {
        //cancelado
        data.Status = 4;
        localStorage.setItem("list_Citas", JSON.stringify($scope.list_Citas));
    }

    $scope.export_Excel = function() {
        var tableData = '';
        tableData += '<table border="2">' +
            '<thead class="lockedRecordsBg">' +
            '<tr  style="height: 50px;  width: 250px">' +
            '<th bgcolor="#ffff00"  style="width:100px">id </th>' +
            '<th bgcolor="#ffff00"  style="width:100px">ClienteName </th>' +
            '<th bgcolor="#ffff00" style="width:150px">Details </th>' +
            '<th bgcolor="#ffff00" style="width:150px;text-align:left;">Type</th>'+
            '<th bgcolor="#ffff00" style="width:150px;text-align:left;">Fecha</th>'+
            '<th bgcolor="#ffff00" style="width:150px;text-align:left;">Hora</th>';
        

        tableData +=
            '</tr>' +
            '</thead>' +
            '<tbody >';

        $.each($scope.list_Citas, function () {
            let url = '';
            if (this.PhotoWebURL !== null) {
                url = this.PhotoWebURL
            }

            tableData += '<tr>' +
                '<td style="text-align:left;">' + this.id + '</td>' +
                '<td style="text-align:left;">' + this.ClienteName + '</td>' +
                '<td style="text-align:left;">' + this.Details + '</td>' +
                '<td style="text-align:left;">' + this.Type + '</td>' +
                '<td style="text-align:left;">' + this.Fecha + '</td>' +
                '<td style="text-align:left;">' + this.Hora + '</td>';
            

            tableData += '</tr>';
        });

        tableData += '</tbody>' +
            '</table>';


        tableData = tableData.replace(/<A[^>]*>|<\/A>/g, ""); //remove if u want links in your table
        tableData = tableData.replace(/<input[^>]*>|<\/input>/gi, ""); //remove input params
        
        let a = document.createElement('a');
        a.href = `data:application/vnd.ms-excel, ${encodeURIComponent(tableData)}`

        var name = 'ReportedeCitas';
        a.download = '' + name + '.xls'
        a.click()
    }

    $scope.Clear = function(){
        $scope.mastersearch='';
        $scope.ValToSrch='';
    }

    $scope.Mensaje = function(orden) {
        //validar si el telefono es numerico
        var urlApiwhatsapp = 'https://api.whatsapp.com/send?phone';
        var text = "👋 Saludos,➡️ me comunico desde la pagina de dentistas ⬅️ , Hablo con usted para ver si me podia dar soporte con unas dudas??";
            
        window.open(urlApiwhatsapp + "=+5216642939122&text=" + text, "_blank");

    }

});