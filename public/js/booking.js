// // Modal logic
// const modal = document.getElementById('reserveModal');
// const btn = document.getElementById('reserveBtn');
// const span = document.querySelector('.close');
// if(btn) btn.onclick = () => modal.style.display = "block";
// if(span) span.onclick = () => modal.style.display = "none";
// window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };

// // Payment logic
// const form = document.getElementById('reservationForm');
// const paymentStep = document.getElementById('paymentStep');
// const confirmPayBtn = document.getElementById('confirmPayBtn');
// const baseAmountEl = document.getElementById('baseAmount');
// const taxAmountEl = document.getElementById('taxAmount');
// const totalAmountEl = document.getElementById('totalAmount');

// let reservationData = {};

// if(form) {
//     form.onsubmit = function(e) {
//         e.preventDefault();
//         // Get price from data attribute
//         const baseAmount = parseInt(form.dataset.price, 10);
//         const tax = Math.round(baseAmount * 0.12);
//         const total = baseAmount + tax;
//         form.style.display = "none";
//         paymentStep.style.display = "block";
//         baseAmountEl.textContent = baseAmount.toLocaleString("en-IN");
//         taxAmountEl.textContent = tax.toLocaleString("en-IN");
//         totalAmountEl.textContent = total.toLocaleString("en-IN");
//         const data = new FormData(form);
//         reservationData = {
//             checkIn: data.get('checkIn'),
//             checkOut: data.get('checkOut'),
//             guests: data.get('guests'),
//             total: total
//         };
//     };
// }

// if(confirmPayBtn) {
//     confirmPayBtn.onclick = function() {
//         modal.style.display = "none";
//         const receipt = `
// Reservation Receipt

// Listing: ${form.dataset.title}
// Check-in: ${reservationData.checkIn}
// Check-out: ${reservationData.checkOut}
// Guests: ${reservationData.guests}
// Total Paid: ₹${reservationData.total.toLocaleString("en-IN")}
// Thank you for your reservation!
// Share this receipt with your friends!
//         `;
//         const blob = new Blob([receipt], { type: "text/plain" });
//         const link = document.createElement('a');
//         link.href = URL.createObjectURL(blob);
//         link.download = "receipt.txt";
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);

//         if (navigator.share) {
//             navigator.share({
//                 title: 'Reservation Receipt',
//                 text: receipt
//             });
//         } else {
//             alert("Payment Successful! Receipt downloaded. You can share the file manually.");
//         }
//         form.reset();
//         form.style.display = "block";
//         paymentStep.style.display = "none";
//     };
// }

const modal = document.getElementById('reserveModal');
const btn = document.getElementById('reserveBtn');
const span = document.querySelector('.close');
if (btn) btn.onclick = () => modal.style.display = "block";
if (span) span.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };

const form = document.getElementById('reservationForm');
const paymentStep = document.getElementById('paymentStep');
const confirmPayBtn = document.getElementById('confirmPayBtn');
const baseAmountEl = document.getElementById('baseAmount');
const taxAmountEl = document.getElementById('taxAmount');
const totalAmountEl = document.getElementById('totalAmount');
const receiptContainer = document.getElementById('receiptContainer');
const receiptContent = document.getElementById('receiptContent');
const downloadBtn = document.getElementById('downloadBtn');
const printBtn = document.getElementById('printBtn');
const shareBtn = document.getElementById('shareBtn');
const usernameEl = document.getElementById('currentUsername');

let reservationData = {};

function calculateDays(checkIn, checkOut) {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const diff = outDate - inDate;
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 1);
}

if (form) {
  form.onsubmit = function(e) {
    e.preventDefault();
    const data = new FormData(form);
    const checkIn = data.get('checkIn');
    const checkOut = data.get('checkOut');
    const guests = parseInt(data.get('guests'), 10);
    const days = calculateDays(checkIn, checkOut);
    const unitPrice = parseInt(form.dataset.price, 10);
    const base = guests * days * unitPrice;
    const tax = Math.round(base * 0.18);
    const total = base + tax;

    reservationData = { checkIn, checkOut, guests, days, base, tax, total };

    baseAmountEl.textContent = base.toLocaleString("en-IN");
    taxAmountEl.textContent = tax.toLocaleString("en-IN");
    totalAmountEl.textContent = total.toLocaleString("en-IN");

    form.style.display = "none";
    paymentStep.style.display = "block";
  };
}

if (confirmPayBtn) {
  confirmPayBtn.onclick = function () {
    const title = form.dataset.title;
    const { checkIn, checkOut, guests, days, base, tax, total } = reservationData;
    const username = usernameEl ? usernameEl.dataset.username : "Unknown User";
    const receiptText = `
ToursPackeges.com
----------------------------
Reservation Receipt

Reservation Holder: ${username}
Listing: ${title}
Check-in: ${checkIn}
Check-out: ${checkOut}
Guests: ${guests}
Duration: ${days} day(s)

Base Amount: ₹${base.toLocaleString("en-IN")}
GST (18%): ₹${tax.toLocaleString("en-IN")}
----------------------------
Total Paid: ₹${total.toLocaleString("en-IN")}
----------------------------

Thank you for your reservation!
Share this receipt with your friends!
    `.trim();

    receiptContent.textContent = receiptText;
    receiptContainer.style.display = "block";
    paymentStep.style.display = "none";

    downloadBtn.onclick = () => {
      const blob = new Blob([receiptText], { type: "text/plain" });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = "reservation_receipt.txt";
      link.click();
    };

    printBtn.onclick = () => {
      const printWindow = window.open('', '', 'width=600,height=600');
      printWindow.document.write(`<pre>${receiptText}</pre>`);
      printWindow.document.close();
      printWindow.print();
    };

    shareBtn.onclick = () => {
      if (navigator.share) {
        navigator.share({
          title: 'ToursPackeges.com Receipt',
          text: receiptText
        });
      } else {
        alert("Sharing not supported on this browser.");
      }
    };

    form.reset();
  };
}