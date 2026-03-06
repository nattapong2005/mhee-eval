import Swal from 'sweetalert2';

const MySwal = Swal.mixin({
    background: '#111827', // Gray-900 to match your theme
    color: '#f3f4f6', // Gray-100
    confirmButtonColor: '#EB4C4C', // Your primary-500 color
    cancelButtonColor: '#374151', // Gray-700
});

export default MySwal;
