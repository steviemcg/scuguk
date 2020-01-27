// TODO: I really don't want to pass isAuthenticated and getIdTokenClaims
// but React starts complaining about breaking Hook Rules otherwise
// because I suck at React

const MyFetch = async (url, isAuthenticated, getIdTokenClaims) => {
    let headers = {};

    if (isAuthenticated) {
        var claims = await getIdTokenClaims();
        if (claims) {
            // TODO: Should use access_token instead of id_token
            headers = {
                Authorization: `Bearer ${claims.__raw}`
            };
        }
    }

    //return await fetch(`${process.env.SCUG_API}${url}`, {
    return await fetch(`https://scuguk.azurewebsites.net${url}`, {
        headers: headers
    });
}

export default MyFetch