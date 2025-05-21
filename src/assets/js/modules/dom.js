// Crear la keyframe animation
const style = document.createElement('style');
style.textContent = `
  @keyframes floatingIcon {
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0); }
  }

  .footer-icon {
    animation: floatingIcon 3s ease-in-out infinite;
  }
`;
document.head.appendChild(style);

// Aplicar la clase a los iconos del footer
document.querySelectorAll('.footer i').forEach(icon => {
    icon.classList.add('footer-icon');
});