const authenticityToken = function() {
    const token: ?HTMLElement = document.querySelector('meta[name="csrf-token"]')
    if (token && (token instanceof window.HTMLMetaElement)) {
        return token.content;
    }
    return null
}

export const authenticityHeaders = function(otherHeaders: {[id:string]: string} = {}) {
    return Object.assign(otherHeaders, {
        'X-CSRF-Token': authenticityToken(),
        'X-Requested-With': 'XMLHttpRequest',
    });
}

