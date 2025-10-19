export function formatAustralianPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\(\)\-]/g, '');
  
  if (cleaned.startsWith('+61')) {
    const number = cleaned.substring(3);
    if (number.startsWith('4')) {
      return `+61 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
    } else {
      return `+61 ${number.substring(0, 1)} ${number.substring(1, 5)} ${number.substring(5)}`;
    }
  } else if (cleaned.startsWith('04')) {
    return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
  } else if (cleaned.startsWith('0')) {
    return `${cleaned.substring(0, 2)} ${cleaned.substring(2, 6)} ${cleaned.substring(6)}`;
  }
  
  return phone;
}
