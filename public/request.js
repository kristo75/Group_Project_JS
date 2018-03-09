const Request = function(url){
  this.url = url;
}

Request.prototype.get = function(callback, apiKey){
  const request = new XMLHttpRequest();
  request.open('GET', this.url);
  if (apiKey){
    request.setRequestHeader('x-api-key', apiKey)
  }
  request.addEventListener('load', function(){
    if(this.status !== 200){
      return;
    }
    const responseBody = JSON.parse(this.responseText);
    console.log(responseBody);
    callback(responseBody);
  });
  request.send();
}

Request.prototype.post = function(payload, callback){
  const request = new XMLHttpRequest();
  request.open('POST', this.url);
  request.setRequestHeader('Content-Type', 'application/json');
  request.addEventListener('load', function(){
    if(this.status !== 201){
      return;
    }
    const responseBody = JSON.parse(this.responseText);
    callback(responseBody);
  });
  request.send(JSON.stringify(payload));
}

module.exports = Request;
