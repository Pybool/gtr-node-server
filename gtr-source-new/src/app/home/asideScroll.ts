
declare const $: any;
export function trackScrolling(){
    window.addEventListener('scroll', function() {
        const stickyElement = document.getElementById('grand_news_category-4');
        const elementRect = stickyElement.getBoundingClientRect();
      
        // Check if the element is within 20px from the top of the viewport
        console.log("Scroll ", elementRect.top)
        if (elementRect.top <= 40) {
          stickyElement.style.position = 'fixed';
          stickyElement.style.top = '40px';
        } else {
        //   stickyElement.style.position = 'relative'; // Reset it if it's above 20px
        }
      });
      
      
}