/* Efeito no background na seção 2 */

window.addEventListener('scroll', function() {
    var scrollY = window.scrollY;
    var scale = Math.max(1, 1.5 - scrollY / window.innerHeight);
    var opacity = Math.min(1, scrollY / window.innerHeight);
    var headline = document.getElementById('headline');
    headline.style.transform = 'scale(' + scale + ')';
    headline.style.opacity = opacity;

    // Parallax effect for background images
    var parallaxElements = document.querySelectorAll('.img');
    parallaxElements.forEach(function(element) {
        var size = 300 + scrollY * 0.1; // Adjust the multiplier for a more or less pronounced effect
        element.style.backgroundSize = size + 'px';
    });
});

/* Efeito de transição na seção 3 */

window.addEventListener('scroll', function() {
    var scrollY = window.scrollY;
    var windowHeight = window.innerHeight;

    // Seleciona o ícone e a div .ft_info
    var icon = document.querySelector('#ft_box i');
    var ftInfo = document.querySelector('.ft_info');

    // Obtém a posição do elemento em relação ao topo da página
    var ftBoxTop = document.getElementById('ft_box').getBoundingClientRect().top + window.scrollY;

    // Calcula o ponto em que o ícone e a div .ft_info devem começar a aparecer
    var iconStart = ftBoxTop - windowHeight * 1.2; // Começa a aparecer quando metade do elemento entra na viewport
    var infoStart = ftBoxTop - windowHeight * 1; // Começa a aparecer um pouco depois do ícone

    // Calcula o progresso da rolagem
    var iconProgress = Math.min(1, Math.max(0, (scrollY - iconStart) / windowHeight));
    var infoProgress = Math.min(1, Math.max(0, (scrollY - infoStart) / windowHeight));

    // Atualiza as propriedades de transformação e opacidade
    icon.style.transform = 'translateX(' + (50 - iconProgress * 50) + 'px)';
    icon.style.opacity = iconProgress;

    ftInfo.style.transform = 'translateX(' + (-50 + infoProgress * 50) + 'px)';
    ftInfo.style.opacity = infoProgress;
});

/* Efeito de drag */

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    isDragging = true;
    dragStartX = ev.clientX;
    dragStartY = ev.clientY;
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var thumbnail = document.getElementById(data);
    var mainImageRect = document.getElementById("mainImage").getBoundingClientRect();
    var offsetX = ev.clientX - mainImageRect.left;
    var offsetY = ev.clientY - mainImageRect.top;
    thumbnail.style.position = 'absolute';
    thumbnail.style.left = offsetX + 'px';
    thumbnail.style.top = offsetY + 'px';
    thumbnail.style.transform = 'translate(-50%, -50%)';
    thumbnail.style.zIndex = '1000';
    if (!document.getElementById("mainImage").contains(thumbnail)) {
        document.getElementById("mainImage").appendChild(thumbnail);
    }
    setTimeout(() => {
        isDragging = false;
    }, 100);
}

interact('.thumbnail')
    .draggable({
        inertia: true,
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: 'parent',
                endOnly: true
            })
        ],
        autoScroll: true,
        listeners: {
            move: dragMoveListener
        }
    })
    .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
            move(event) {
                let target = event.target;
                let x = (parseFloat(target.getAttribute('data-x')) || 0);
                let y = (parseFloat(target.getAttribute('data-y')) || 0);

                target.style.width = event.rect.width + 'px';
                target.style.height = event.rect.height + 'px';

                x += event.deltaRect.left;
                y += event.deltaRect.top;

                target.style.transform = 'translate(' + x + 'px,' + y + 'px)';

                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        },
        modifiers: [
            interact.modifiers.restrictEdges({
                outer: 'parent',
                endOnly: true
            }),
            interact.modifiers.restrictSize({
                min: { width: 50, height: 50 }
            })
        ],
        inertia: true
    });

function dragMoveListener(event) {
    var target = event.target;
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

function openPopup(event, element) {
    if (isDragging) {
        isDragging = false;
        return;
    }
    var imgSrc = element.querySelector('img').src;
    document.getElementById('popupImage').src = imgSrc;
    document.getElementById('imagePopup').style.display = 'flex';
    document.documentElement.style.overflow = 'hidden';
}

function closePopup(event) {
    if (event.target.id === 'imagePopup' || event.target.className === 'popup-close') {
        document.getElementById('imagePopup').style.display = 'none';
    }
    document.documentElement.style.overflow = 'auto';
}
 
 // Seta de volta ao topo do site | Back to Top

(function() {
  "use strict";

  document.addEventListener('DOMContentLoaded', function() {
      var progressWraps = document.querySelectorAll('.progress-wrap, .circle.progress-wrap');
      var pathLengths = [];
      var progressPaths = [];

      progressWraps.forEach(function(progressWrap) {
          var progressPathsInWrap = progressWrap.querySelectorAll('path');
          progressPathsInWrap.forEach(function(progressPath) {
              var pathLength = progressPath.getTotalLength();
              pathLengths.push(pathLength);
              progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
              progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
              progressPath.style.strokeDashoffset = pathLength;
              progressPath.getBoundingClientRect();
              progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
              progressPaths.push(progressPath);
          });

          progressWrap.addEventListener('click', function(event) {
              event.preventDefault();
              scrollToTop();
          });
      });

      var updateProgress = function() {
          var scroll = window.scrollY;
          var height = document.documentElement.scrollHeight - window.innerHeight;

          pathLengths.forEach(function(pathLength, index) {
              var progress = pathLength - (scroll * pathLength / height);
              progressPaths[index].style.strokeDashoffset = progress;
          });

          progressWraps.forEach(function(progressWrap) {
              if (window.scrollY > 50) {
                  progressWrap.classList.add('active-progress');
              } else {
                  progressWrap.classList.remove('active-progress');
              }
          });
      };

      updateProgress();
      window.addEventListener('scroll', updateProgress);

function scrollToTop() {
  var currentPosition = document.documentElement.scrollTop || document.body.scrollTop;

  if (currentPosition > 0) {
      if ('scrollBehavior' in document.documentElement.style) {
          window.scrollTo({
              top: 0,
              behavior: 'auto' // Usar 'auto' para desativar a rolagem suave temporariamente
          });
      } else {
          window.scrollTo(0, currentPosition - Math.min(currentPosition, 50));
          window.requestAnimationFrame(scrollToTop);
      }
  }
}


  });

})();