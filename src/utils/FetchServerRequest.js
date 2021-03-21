const fetchServerDataGet = async (url, headers) => {
    try {
        let response = await fetch(url, {
            method: 'GET', headers: headers
        });
        return await response;
    }
    catch (error) {
        console.error('Error ==> ', error);
    }
};


const fetchServerDataPost = async (url, requestBody, headers) => {
    try {
        let response = await fetch(url, {
            method: 'POST', headers: headers, body: JSON.stringify(requestBody)
        });
        return await response; // response.json(), status, etc
    }
    catch (error) {
        console.error(error);
    }

};

const fetchServerDataPostFormData = async (url, requestBody, headers) => {
    try {
        console.log("url----" + url);
        console.log("requestBody----" + JSON.stringify(requestBody));
        console.log("headers----" + JSON.stringify(headers));
        let response = await fetch(url, {
            method: 'POST', headers: headers, body: requestBody
        });
        return await response; // response.json(), status, etc
    }
    catch (error) {
        console.error('error==> ' + error);
    }

};


const fetchServerDataPut = async (url, requestBody, headers) => {
    try {
        let response = await fetch(url, {
            method: 'PUT', headers: headers, body: JSON.stringify(requestBody)
        });
        return await response;
    }
    catch (error) {
        console.error(error);
    }
};


const fetchServerDataDelete = async (url) => {
    try {
        let response = await fetch(url, {
            method: 'DELETE'
        });
        return await response;
    }
    catch (error) {
        console.error(error);
    }
};

export {
    fetchServerDataGet,
    fetchServerDataPost,
    fetchServerDataPut,
    fetchServerDataDelete,
    fetchServerDataPostFormData
}

