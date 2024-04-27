const currencyList = {
  USD: {
    id: "USD",
    name: "United States Dollar",
    symbol: "$",
    websites: [
      { name: "LendingClub", url: "https://www.lendingclub.com/" },
      { name: "Prosper", url: "https://www.prosper.com/" },
      { name: "SoFi", url: "https://www.sofi.com/" },
      { name: "Avant", url: "https://www.avant.com/" }
    ]
  },
  INR: {
    id: "INR",
    name: "Indian Rupee",
    symbol: "₹",
    websites: [
      { name: "HDFC Bank", url: "https://www.hdfcbank.com/personal/loans" },
      { name: "ICICI Bank", url: "https://www.icicibank.com/" },
      { name: "Axis Bank", url: "https://www.axisbank.com/" },
      { name: "State Bank of India", url: "https://www.sbi.co.in/" }
    ]
  },
  PKR: {
    id: "PKR",
    name: "Pakistani Rupee",
    symbol: "Rs",
    websites: [
      { name: "EasyPaisa", url: "https://www.easypaisa.com.pk/" },
      { name: "JazzCash", url: "https://www.jazzcash.com.pk/" },
      { name: "Rizq", url: "https://www.rizq.com/" },
      { name: "Meezan Bank", url: "https://www.meezanbank.com/" },
      { name: "UBL", url: "https://www.ubldigital.com/" },
      { name: "Bank Alfalah", url: "https://www.bankalfalah.com/" },
      { name: "Askari Bank", url: "https://askaribank.com/" }
    ]
  }
  // Add more currencies here as needed
};

export default currencyList;
