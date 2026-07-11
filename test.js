try {
  console.log("Setting item");
  // localStorage is not in node, but imagine it throws
  throw new Error("QuotaExceededError");
} catch (e) {
  console.log("Caught", e.message);
}
