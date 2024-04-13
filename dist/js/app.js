var app = angular.module('CitasApp', [])


app.controller('CitasController', function ($scope) {


$scope.list_Citas = JSON.parse(localStorage.getItem("list_Citas"));
if(!$scope.list_Citas){
    $scope.list_Citas = [];
}

    $('#daterangepicker_LoadDate').daterangepicker({
        singleDatePicker: true,

        startDate: moment(), // Fecha y hora actual
        locale: {
            format: 'Y/M/DD '
        }
    });

    $('#daterangepicker_LoadDate').on('apply.daterangepicker', function (ev, picker) {
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
        }, function (start, end, label) {
            // Manejar la acción de aplicar aquí
            $scope.LoadDate = start.format('M/DD/Y');

            // Realizar otras operaciones necesarias con la fecha y hora seleccionadas
        });
    }


    $scope.Openmodal_NewCita = function () {
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

    $scope.Openmodal_EditCita = function (data) {
        $scope.EditModal_Cita = true;
        RefreshDateRanger(data.Fecha + ' '+ data.Hora);
        $scope.LoadDate = data.Fecha;
        $scope.NameCliente = data.ClienteName;
        $scope.Details = data.Details;
        $scope.Type = data.Type;
        var inputHora = angular.element(document.querySelector('#inputHora'));
        // Asignar el valor de la hora al campo de entrada
        inputHora[0].value = data.Hora;
        $('#NewCita').modal({
            backdrop: 'static',
            keyboard: false,
            show: true
        });
    }

    $scope.Click_search = function (data) {
        $scope.mastersearch = data;
    }

    $scope.Save_Cita = function () {
        let inputHora = document.getElementById("inputHora");
        let valorActual = inputHora.value;

        $scope.list_Citas.push(
            {
                id: $scope.list_Citas.length + 1,
                ClienteName: $scope.NameCliente,
                Details: $scope.Details,
                Fecha: $scope.LoadDate,
                Hora: valorActual,
                Status: 1,
                Type: $scope.Type
            }
        );

        
        localStorage.setItem("list_Citas", JSON.stringify($scope.list_Citas));


    }

    $scope.Cita_ChangeWorking = function (data) {
        data.Status = 2;
        localStorage.setItem("list_Citas", JSON.stringify($scope.list_Citas));
    }

    $scope.Cita_ChangeCompleted = function (data) {
        data.Status = 3;
        localStorage.setItem("list_Citas", JSON.stringify($scope.list_Citas));
    }

    $scope.Cita_ChangeCancel = function (data) {
        data.Status = 4;
        localStorage.setItem("list_Citas", JSON.stringify($scope.list_Citas));
    }

    $scope.export_Excel = function (){
        alasql('SELECT id,ClienteName,Details,Fecha,Hora, INTO XLSX("' + name + '.xlsx",{headers:true}) FROM ? ', [$scope.list_Citas]);
    }

});