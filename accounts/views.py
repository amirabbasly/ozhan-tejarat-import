# accounts/views.py
from rest_framework.viewsets import ModelViewSet

from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser, Costumer, Company
from .serializers import UserSerializer, LoginSerializer, CostumerSerializer, CostumuserSerializer, UpdateCurrentUserSerializer, ChangePasswordSerializer, CompanySerializer
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import viewsets
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        refresh = RefreshToken.for_user(user)
        return Response({
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'user': {
                'email': user.email,
                'username': user.username,
                'role': user.role,
                'phone_number': user.phone_number,
                'birth_date': user.birth_date,
            }
        })

class UserRolesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'role': request.user.role})
class costumerViewSet(ModelViewSet):
    queryset = Costumer.objects.all()
    serializer_class = CostumerSerializer
    @action(detail=False, methods=['get'], url_path='by-id/(?P<costumer_id>[^/.]+)')
    def get_costumer_by_id(self, request, costumer_id=None):
        try:
            costumer = Costumer.objects.get(id=costumer_id)
            serializer = CostumerSerializer(costumer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Costumer.DoesNotExist:
            return Response(
                {"error": "Customer not found."},
                status=status.HTTP_404_NOT_FOUND
            )

class CostumerListView(APIView):
    def get(self, request):
        # Retrieve all Performa instances
        costumers = Costumer.objects.all()
        # Serialize the queryset
        serializer = CostumerSerializer(costumers, many=True)
        # Return the serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        serializer = CostumuserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateCurrentUserView(APIView):
    parser_classes = [MultiPartParser, FormParser] 

    def put(self, request):
        user = request.user
        serializer = UpdateCurrentUserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):  
        user = request.user
        serializer = UpdateCurrentUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            if not user.check_password(old_password):
                return Response(
                    {"old_password": ["Wrong password."]},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user.set_password(new_password)
            user.save()
            return Response({"detail": "Password changed successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    search_fields = ["full_name" ]  # fields you want to search
