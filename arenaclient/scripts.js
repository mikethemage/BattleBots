// scripts.js

// Global variables to store the interval and timeout IDs
let intervalId;
let timeoutId;

$(function () {
    const BASE_URL = config.baseUrl;
    const SPINNER_COUNT = config.spinnerCount;

    $('#start120').on("click", function () {
        callApi(`${BASE_URL}/start120`, 'GET');
        startRound(120);        
    });

    $('#start180').on("click", function () {
        callApi(`${BASE_URL}/start180`, 'GET');
        startRound(180);        
    });

    $('#startduck').on("click", function () {
        callApi(`${BASE_URL}/startduck`, 'GET');
        startRound(75);        
    });

    $('#stopround').on("click", function () {
        callApi(`${BASE_URL}/stop`, 'GET');        
        stopUi();      
    });

    $('#flipper').on("click", function () {
        callApi(`${BASE_URL}/flipper`, 'GET');
        disableButton($('#flipper'), 1);
    });

    $('#pit').on("click", function () {
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
        clearInterval(intervalId); // Clear the interval
        clearTimeout(timeoutId); // Clear the timeout
        $('.start-button').prop('disabled', false);
        $('.stop-button').prop('disabled', true);
        $('.spinner-off').prop('checked',true);
        $('.arena-hazard').prop('disabled', true);  
    }

    function startRound(length) {
        $('.start-button').prop('disabled', true);
        $('.stop-button').prop('disabled', false);
        $('.arena-hazard').prop('disabled', false);

        // Initialize the counter display
        showCountdown(length * 1000);
        
        // Get the current UTC timestamp (milliseconds since January 1, 1970)
        const utcTimestamp = new Date().getTime();

        // Convert seconds to milliseconds and add to the current UTC timestamp
        const newTimestamp = utcTimestamp + length * 1000;

        // Create a new Date object with the updated timestamp
        let newDate = new Date(newTimestamp);        

        // Create an interval to update the counter every second
        intervalId = setInterval(() => {
            const utcTimestamp = new Date().getTime();
            const differenceInMilliseconds = newDate - utcTimestamp;                       

            // Check if time has run out
            if (differenceInMilliseconds <= 0) {
                clearInterval(intervalId); // Clear the interval when the time is up
                showCountdown(0);
            }
            else {
                // Update the counter display
                showCountdown(differenceInMilliseconds);
            }
        }, 50);

        setTimeout(() => {
            stopUi();
            showCountdown(0);
        }, length * 1000);
    }

    function showCountdown(timeRemaining) {

        var minutes = Math.floor(timeRemaining / (60 * 1000));
        var seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);
        var milliseconds = timeRemaining % 1000;
        
        $('#time-remaining.d-none').removeClass('d-none');
        $('#time-remaining').text( (minutes < 10 ? '0' : '') + minutes + ':' +
        (seconds < 10 ? '0' : '') + seconds + '.' +
        (milliseconds < 100 ? '0' : '') +
        (milliseconds < 10 ? '0' : '') + milliseconds);
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
