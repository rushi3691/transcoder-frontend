//Response when JWT is not valid.
var response401 = {
  statusCode: 401,
  statusDescription: "Unauthorized",
};

async function jwt_decode(token, key, noVerify, algorithm) {
  // check token
  if (!token) {
    throw new Error("No token supplied");
  }
  // check segments
  var segments = token.split(".");
  if (segments.length !== 3) {
    throw new Error("Not enough or too many segments");
  }

  // All segment should be base64
  var headerSeg = segments[0];
  var payloadSeg = segments[1];
  var signatureSeg = segments[2];

  // base64 decode and parse JSON
  var header = JSON.parse(_base64urlDecode(headerSeg));
  var payload = JSON.parse(_base64urlDecode(payloadSeg));

  if (!noVerify) {
    var signingMethod = "SHA-256";
    var signingType = "hmac";

    // Verify signature. `sign` will return base64 string.
    var signingInput = [headerSeg, payloadSeg].join(".");

    if (!_verify(signingInput, key, signingMethod, signingType, signatureSeg)) {
      throw new Error("Signature verification failed");
    }

    // Support for nbf and exp claims.
    // According to the RFC, they should be in seconds.
    if (payload.nbf && Date.now() < payload.nbf * 1000) {
      throw new Error("Token not yet active");
    }

    if (payload.exp && Date.now() > payload.exp * 1000) {
      throw new Error("Token expired");
    }
  }

  return payload;
}

//Function to ensure a constant time comparison to prevent
//timing side channels.
function _constantTimeEquals(a, b) {
  if (a.length != b.length) {
    return false;
  }

  var xor = 0;
  for (var i = 0; i < a.length; i++) {
    xor |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return 0 === xor;
}

async function _verify(input, key, method, type, signature) {
  if (type === "hmac") {
    const signedInput = await _sign(input, key, method);
    return _constantTimeEquals(signature, signedInput);
  } else {
    throw new Error("Algorithm type not recognized");
  }
}

async function _sign(input, key, method) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: method },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, data);
  return btoa(String.fromCharCode.apply(null, new Uint8Array(signature)));
}

function _base64urlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  return decodeURIComponent(encodeURIComponent(atob(str)));
}

async function handler(event) {
  //Secret key used to verify JWT token.
  //Update with your own key.
  var key = "9ff9dd287765acb2e02238dadfc80d6d7249738be94e01cbe425aaca4f5c039e";

  var request = event.request;
  var headers = request.headers;

  // Check if Authorization header is present
  try {
    // if (!headers.authorization) {
    //   throw new Error("No Authorization header");
    // }

    // // Extract the token
    // var token = headers.authorization.value;
    // // If the token is prefixed with "Bearer ", remove that prefix
    // if (token.startsWith("Bearer ")) {
    //   token = token.slice(7, token.length);
    // }

    if (!headers.cookie) {
      throw new Error("No Cookie header");
    }

    // Extract the cookies and find the session token
    var cookies = headers.cookie.split("; ");
    var token = null;
    for (var i = 0; i < cookies.length; i++) {
      if (cookies[i].startsWith("next-auth.session-token=")) {
        token = cookies[i].split("=")[1];
        break;
      }
    }

    await jwt_decode(token, key);
  } catch (e) {
    console.log("Invalid JWT token");
    console.log(e);
    return response401;
  }

  console.log("Valid JWT token");
  return request;
}

var jwtToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJEaW5vQ2hpZXNhLmdpdGh1Yi5pbyIsInN1YiI6ImlkcmlzIiwiYXVkIjoiZXZhbmRlciIsImlhdCI6MTcwMzg3NDUwMiwiZXhwIjoxNzAzODc2NjA5LCJhYWEiOiJwcW9mZ292MnkxczRpNXBtZjZmeDE1In0.xK-prpG8KKJPszZQA6pgLfRlRbXmT3bMr1ZBnw0T4B4";

let eventobj = {
  request: {
    headers: {
      authorization: {
        value: jwtToken,
      },
    },
  },
};

var cookies = `next-auth.csrf-token=397c49a9556de53829fd2a7c19c1637ea6748b6e8a3a6393ddbed2ad6736fef3%7C477b8c01efc56d0baa5253342e7bc36339738bda40a105f871077b2de298c4fe; next-auth.callback-url=http%3A%2F%2Flocalhost%3A3000%2Fupload-video; next-auth.session-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OGQ1ZDEzNDNjYmYxMTUwZmMwNWVmYiIsIm5hbWUiOiJLcmF0b3MiLCJlbWFpbCI6InBpbms1MzkwNkBnbWFpbC5jb20iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jS2RFQlJpMTUwRHBaaWtTYUdDRVRzU0c2azRxb0doZldLcURKOE1IQTdkPXM5Ni1jIiwiaWF0IjoxNzAzOTM4ODk2LCJleHAiOjE3MDY1MzA4OTZ9.wKUFvT_NRCAUijtRckK5tpnuLLR5cGNqrjgxaOhTag0`;

let cookieobj = {
  request: {
    headers: {
      cookie: cookies,
    },
  },
};


handler(cookieobj);
