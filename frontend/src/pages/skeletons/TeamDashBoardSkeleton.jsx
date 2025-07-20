import { Box, Grid, Skeleton } from "@mui/material";

export default function TeamSkeleton() {
  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: "white", minHeight: "100vh" }}>
      <Box sx={{ mx: "auto" }}>
        <Skeleton variant="text" width={300} height={50} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={150} height={30} sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "white",
                  borderRadius: 2,
                  boxShadow: 2,
                  height: 160,
                  width: 150,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Skeleton variant="text" width="80%" height={28} />
                <Skeleton variant="text" width="60%" height={22} />
                <Skeleton variant="text" width="50%" height={20} />
                <Skeleton
                  variant="rectangular"
                  height={36}
                  sx={{ borderRadius: 1, mt: 1 }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>

  );
}
