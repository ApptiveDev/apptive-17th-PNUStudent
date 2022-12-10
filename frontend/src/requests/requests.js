const baseUrl = "http://127.0.0.1:8000"

function requestPost(url,json)
{
    return fetch(
        baseUrl+url,
        {
            headers : 
                { 
                'Content-Type': 'application/json'
                },
            method : 'POST',
            body: JSON.stringify(json)
        }
    ).then(response => 
    {
     if(response.status == 200)
        return response.json();
     else
        throw response.status;
    })
}

function requestPostWithAccess(url,json)
{
    return fetch(
        baseUrl+url,
        {
            headers : 
                { 
                'Content-Type' : 'application/json',
                'Authorization' : 'Token ' + localStorage.getItem("AccessKey")
                },
            method : 'POST',
            body: JSON.stringify(json)
        }
    ).then(response => 
    {
     if(response.status == 200)
        return response.json();
     else
        throw response.status;
    })
}

function requestGet(url,json)
{
    if(json != null)
    {
        url += '/'
        for(let key in json)
            url+="?"+key+"="+String(json[key])
    }

    return fetch(
        baseUrl+url,
        {
            headers : 
                { 
                'Content-Type': 'application/json'
                },
            method : 'GET'
        }
    ).then(response => 
    {
     if(response.status == 200)
     {  
        var result = response.json()
        if(result.error != null)
            throw result.error;
        return result;
     }
     else
        throw response.status;
    })
}


export {requestPost, requestPostWithAccess, requestGet};