type AvailableDatesItem = {
  startDate: string;
  endDate: string;
};

export interface IGetAvailableDatesResponseDTO {
  availableDates: AvailableDatesItem;
}
