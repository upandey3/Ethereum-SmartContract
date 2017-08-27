/* Use jQuery to build out some interaction points with the contract
** ********************************** */
function buildContractControls(deployedContract, readOnlyMethods, mutatingMethods) {
  // show controls / hide forms
  $('#contract-controls-container').show();
  $('#contract-forms-container').hide();

  var boundControlBuilder = buildMethodControlForm.bind(null, deployedContract);

  // controls for the constant methods
  $constantFunctionsControls = $('#constant-functions-controls');
  $constantFunctions = readOnlyMethods.map(boundControlBuilder)
  $constantFunctionsControls.append($constantFunctions)

  // controls for the mutating methods
  $mutatingFunctionsControls = $('#mutating-functions-controls');
  $mutatingFunctions = mutatingMethods.map(boundControlBuilder)
  $mutatingFunctionsControls.append($mutatingFunctions);
}

function buildMethodControlForm (deployedContract, methodConfig) {
  var methodName = methodConfig.name;
  var inputConfigs = methodConfig.inputs || [];

  // Build the DOM
  var $inputs = buildControlInputs(methodConfig);
  var $button = buildControlButton(methodConfig, deployedContract);
  var $results = buildControlResults(methodConfig);

  return $('<div class="row">')
    .append($('<div class="col s6">')
      .append($inputs)
      .append($button))
    .append($('<div class="col s6">')
      .append($results));
}

function buildControlInputs (methodConfig) {
  var methodName = methodConfig.name;
  var inputConfigs = methodConfig.inputs || [];

  var $inputs = inputConfigs.map(buildControlInput.bind(null, methodName));
  if (methodConfig.payable) $inputs.push(buildPayableInput(methodName));

  return $inputs
}

function buildControlInput (methodName, inputConfig) {
  var name = inputConfig.name;
  var type = inputConfig.type || 'text';
  var placeholder = inputConfig.placeholder;
  var label = inputConfig.label || name;
  var id = methodName + '-' + name + '-input';
  return $('<div class="input-field">')
    .append($('<input class="validate">')
      .attr({id, name, type, placeholder}))
    .append($('<label for="' + id + '">')
      .text(label))
}

function buildPayableInput (methodName) {
  return $('<div class="input-field">')
    .append($('<input class="validate">')
      .attr({
        id: methodName + '-value-input',
        name: 'value',
        type: 'number' }))
    .append($('<label for="' + methodName + '-value-input">')
      .text('Value (ether)'))
}

function buildControlButton (methodConfig, deployedContract) {
  var methodName = methodConfig.name;
  var payable = methodConfig.payable;
  var inputConfigs = methodConfig.inputs || [];
  var inputNames = inputConfigs.map(function (inputConfig) {
    inputConfig.name;
  })
  var callback = methodConfig.callback || function (err, result) {
    $('#' + methodName + '-error').text(err && err && err.message);
    $('#' + methodName + '-result').text(result);
  }
  return $('<button class="btn waves-effect waves-light no-uppercase">')
    .text(methodName + '(' + inputNames.join(', ') + ')')
    .click(function(e) {
      var params = inputNames.map(function(name) {
        return $('#' + methodName + '-' + name + '-input').val()
      })
      var transactionObject = { from: web3.eth.coinbase };
      if (methodConfig.payable) {
        /* Payable function
        ** https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethsendtransaction
        ** ********************************** */
        transactionObject.value = $('#' + methodName + '-value-input').val();
        var args = params.concat([transactionObject, callback]);
        console.log({methodName, args});
        deployedContract[methodName].apply(deployedContract, args);
      } else {
        /* Normal function
        ** https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethsendtransaction
        ** ********************************** */
        var args = params.concat([transactionObject, callback])
        console.log({methodName, args});
        deployedContract[methodName].apply(deployedContract, args);
      }
    });
}

function buildControlResults (methodConfig) {
  return $('<div>')
    .append($('<p>')
      .append($('<label>')
        .text('Error:'))
      .append($('<span id="' + methodConfig.name + '-error">')))
    .append($('<p>')
      .append($('<label>')
        .text('Result:'))
      .append($('<span id="' + methodConfig.name + '-result">')));
}
