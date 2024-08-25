// scripts.js
$(document).ready(function () {
    const BASE_URL = config.baseUrl;
    const SPINNER_COUNT = config.spinnerCount;

    $('#start120').click(function () {
        callApi(`${BASE_URL}/start120`, 'GET');
        startRound(120);        
    });

    $('#start180').click(function () {
        callApi(`${BASE_URL}/start180`, 'GET');
        startRound(180);        
    });

    $('#startduck').click(function () {
        callApi(`${BASE_URL}/startduck`, 'GET');
        startRound(75);        
    });

    $('#stopround').click(function () {
        callApi(`${BASE_URL}/stop`, 'GET');        
        stopUi();      
    });

    $('#flipper').click(function () {
        callApi(`${BASE_URL}/flipper`, 'GET');
        disableButton($('#flipper'), 1);
    });

    $('#pit').click(function () {
        callApi(`${BASE_URL}/pit`, 'GET');
        disableButton($('#pit'), 3);
    });

    generateSpinnerControls(SPINNER_COUNT);

    function callApi(endpoint, method) {
        $.ajax({
            url: endpoint,
            method: method,
            success: function (response) {
                console.log('Success:', response);
            },
            error: function (error) {
                console.error('Error:', error);
            }
        });
    }

    function disableButton(button, timeoutSeconds) {
        button.prop('disabled', true);
        setTimeout(() => {
            button.prop('disabled', false);
        }, timeoutSeconds * 1000);
    }

    function stopUi() {
        $('.start-button').prop('disabled', false);
        $('.stop-button').prop('disabled', true);
        $('.spinner-off').prop('checked',true);
        $('.arena-hazard').prop('disabled', true);  
    }

    function startRound(length) {
        $('.start-button').prop('disabled', true);
        $('.stop-button').prop('disabled', false);
        $('.arena-hazard').prop('disabled', false);

        setTimeout(() => {
            stopUi();
        }, length * 1000);
    }

    function controlSpinner(spinnerId, action) {
        let endpoint;
        switch (action) {
            case 'off':
                endpoint = `${BASE_URL}/spinner${spinnerId}off`;
                break;
            case 'clockwise':
                endpoint = `${BASE_URL}/spinner${spinnerId}clockwise`;
                break;
            case 'counterclockwise':
                endpoint = `${BASE_URL}/spinner${spinnerId}counterclockwise`;
                break;
        }
        callApi(endpoint, 'GET');
    }

    function generateSpinnerControls(spinnerCount) {
        for (let i = 1; i <= spinnerCount; i++) {
            $('#spinnerControls').append(`
                        <div class="col-12 col-md-4 text-center">
                            <h5>Spinner ${i}</h5>
                            <div class="btn-group btn-group-sm w-100" role="group" aria-label="Spinner ${i} Control">
                                <input type="radio" class="btn-check arena-hazard spinner-off" name="spinner${i}" id="spinner${i}-off" autocomplete="off" checked disabled>
                                <label class="btn btn-outline-danger w-100 mb-1" for="spinner${i}-off">Off</label>
                                <input type="radio" class="btn-check arena-hazard spinner-on" name="spinner${i}" id="spinner${i}-clockwise" autocomplete="off" disabled>
                                <label class="btn btn-outline-primary w-100 mb-1" for="spinner${i}-clockwise">Clockwise</label>
                                <input type="radio" class="btn-check arena-hazard spinner-on" name="spinner${i}" id="spinner${i}-counterclockwise" autocomplete="off" disabled>
                                <label class="btn btn-outline-primary w-100 mb-1" for="spinner${i}-counterclockwise">Counter-Clockwise</label>
                            </div>
                        </div>
                    `);

            $(`input[name="spinner${i}"]`).change(function () {
                controlSpinner(i, $(this).attr('id').split('-')[1]);
            });
        }
    }
});
