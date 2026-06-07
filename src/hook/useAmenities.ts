import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AmenityService } from "../services/amenity.service";

export const useAmenities = (page: number = 1, perPage: number = 50) => {
  return useQuery({
    queryKey: ["amenities", page, perPage],
    queryFn: () => AmenityService.getAmenities(page, perPage),
    placeholderData: (previousData) => previousData, // keep previous page data while loading new page
  });
};

export const useCreateAmenity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => AmenityService.createAmenity(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["amenities"] });
    },
  });
};

export const useUpdateAmenity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      AmenityService.updateAmenity(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["amenities"] });
    },
  });
};

export const useDeleteAmenity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => AmenityService.deleteAmenity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["amenities"] });
    },
  });
};
