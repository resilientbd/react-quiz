// This is a debug script to check localStorage contents
console.log('=== LOCALSTORAGE DEBUG ===');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(key + ':', value);
}
console.log('========================');