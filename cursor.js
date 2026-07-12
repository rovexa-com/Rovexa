$(document).ready(function() {
      // Create cursor div dynamically
      const $cursor = $('<div class="cb-cursor"></div>');
      $('body').append($cursor);

      // Update cursor position
      $(document).on('mousemove', function(e) {
        $cursor.css({
          left: e.clientX + 'px',
          top: e.clientY + 'px'
        });
      });

      // Add hover effects on elements with [data-cursor]
      $('[data-cursor]').on('mouseenter', function() {
        $cursor.addClass('-pointer');
      }).on('mouseleave', function() {
        $cursor.removeClass('-pointer');
      });
    });







