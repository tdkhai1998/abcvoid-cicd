$(".closeModalBtn").click(() => {
  $(".modal").css("display", "none");
});

let currentYear = new Date().getFullYear();
let startYear = 2015;
while (startYear <= currentYear) {
  startYear++;
  $(".yearOptions").append(`<option value=${startYear}>${startYear}</option>`);
}
let month = 0;
while (month <= 11) {
  month++;
  $(".monthOptions").append(`<option value=${month}>${month}</option>`);
}

// thống kê số lượng truy cập
$(".getAccessNumberBtn").click(() => {
  let year = $(".yearOptions").val();
  console.log(year);
  // đường link get với param year ở đây
  $(".getAccessNumberLink").attr("href", "/link de o day");
});

// thống kê doanh thu theo năm
$(".getRevenueByYearBtn").click(() => {
  let year = $("#revenueByYear-YearOptions").val();
  console.log(year);
  // đường link get với param year ở đây
  $(".getRevenueByYearLink").attr("href", "/link de o day");
});

// thống kê doanh thu theo tháng
$(".getRevenueByMonthBtn").click(() => {
  let year = $("#revenueByMonth-YearOptions").val();
  let month = $("#revenueByMonth-MonthOptions").val();
  console.log(year, month);
  // đường link get với param year,month ở đây
  $(".getRevenueByMonthLink").attr("href", "/link de o day");
});
