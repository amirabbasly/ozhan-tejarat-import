from django.shortcuts import render
from django.core.management import call_command
from django.http import JsonResponse

def get_ssdsshGUID(request):
    if request.method == "POST":
        ssdsshGUID = request.POST.get('ssdsshGUID')

        # Check if ssdsshGUID was provided
        if not ssdsshGUID:
            return render(request, 'get_ssdsshGUID.html', {'error': 'Please enter a valid ssdsshGUID.'})

        try:
            # Run the command with the provided ssdsshGUID
            call_command('your_command_name', ssdsshGUID=ssdsshGUID)
            return render(request, 'get_ssdsshGUID.html', {'success': True})

        except Exception as e:
            # If an error occurs, pass the error message to the template
            return render(request, 'get_ssdsshGUID.html', {'error': str(e)})

    # Render the initial form if not POST
    return render(request, 'get_ssdsshGUID.html')
