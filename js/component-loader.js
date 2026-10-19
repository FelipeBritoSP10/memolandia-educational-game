async function loadComponent(containerId, filePath) {
    try {
        const response = await fetch(filePath);
        if (response.ok) {
            document.getElementById(containerId).innerHTML = await response.text();
        } else {
            console.error(`Erro ao carregar componente: ${filePath}`);
        }
    } catch (error) {
        console.error(`Falha no fetch do componente ${filePath}:`, error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await Promise.all([
        loadComponent("navbar-container", "./components/navbar.html"),
        loadComponent("footer-container", "./components/footer.html"),
        loadComponent("help-modal-container", "./components/modal-help.html"),
        loadComponent("about-modal-container", "./components/modal-about.html"),
        loadComponent("win-modal-container", "./components/modal-win.html")
    ]);
});