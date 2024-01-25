import {alpha, darken, lighten} from "@mui/material";

export const defaultTheme = secondary => ({
    palette: {
        primary: {
            main: '#271c1c',
        },
        secondary: {
            main: secondary || '#8000FF',
        },
        background: {
            default: '#f0f0f0',
            paper: '#ffffff',
        }
    },
    spacing: 10,
    components: {
        MuiButton: {
            defaultProps: {
                size: "small",
            },
            styleOverrides: {
                root: {
                    minWidth: 0,
                }
            }
        },
        MuiRadio: {
            defaultProps: {
                size: "small",
            },
        },
        MuiSlider: {
            defaultProps: {
                size: "small",
            },
        },
        MuiCheckbox: {
            defaultProps: {
                size: "small",
            },
        },
        MuiToggleButtonGroup: {
            defaultProps: {
                size: 'small'
            }
        },
        MuiIconButton: {
            defaultProps: {
                size: "small",
            }
        },
        MuiCssBaseline: {
            styleOverrides: theme => ({
                '*::-webkit-scrollbar': {
                    width: 10,
                    height: 10,
                },
                '*::-webkit-scrollbar-track': {
                    display: 'none',
                },
                '*::-webkit-scrollbar-thumb': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: 5,
                },
                '*:hover::-webkit-scrollbar-thumb': {
                    backgroundColor: lighten(theme.palette.primary.main, 0.2),
                },
                '*::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: theme.palette.primary.main,
                },
                '*::-webkit-scrollbar-thumb:active': {
                    backgroundColor: darken(theme.palette.primary.main, 0.2),
                },
            })

        }
    }
})

export const selectionColor = [
    // '#2196f3',
    '#8000FF',
    '#D4AF37'
    // '#f44336',
]

