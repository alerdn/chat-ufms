function main() {
    if (isUserSignedIn()) {
        document.querySelector("#login-container").classList.replace("d-flex", "d-none");
    } else {
        document.querySelector("#input-container").classList.replace("d-flex", "d-none");
    }
}

main();
