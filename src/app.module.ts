import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientInformationModule } from './patient_information/patient_information.module';
import { MedicationModule } from './medication_log/medicationLog.module';
import { VitalSignsModule } from './vital_signs/vital_signs.module';
// import { MedicalHistoryModule } from './medical_history/medical_history.module';
import { LabResultsModule } from './lab_results/lab_results.module';
import { NotesModule } from './notes/notes.module';
import { AppointmentModule } from './appointment/appointment.module';
import { EmergencyContactModule } from './emergency_contact/emergency_contact.module';
import { UsersModule } from './users/users.module';
import { CompanyModule } from './company/company.module';
import { UserAccessLevelModule } from './user_access_level/user_access_level.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { PrescriptionModule } from './prescription/prescription.module';
import { PatientInformation } from './patient_information/entities/patient_information.entity';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
// import { ApiKeyGuard } from './auth/api-key/api-key.guard';
import { AllergyModule } from './allergy/allergy.module';
import { SurgeryModule } from './surgery/surgery.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.local' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      logging: process.env.DB_LOGGING === 'true',
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      autoLoadEntities: true, // Automatically load entities without the need for the entities array
    }),
    UsersModule,
    RoleModule,
    UserAccessLevelModule,
    PatientInformationModule,
    MedicationModule,
    VitalSignsModule,
    // MedicalHistoryModule,
    LabResultsModule,
    NotesModule,
    AppointmentModule,
    EmergencyContactModule,
    CompanyModule,
    AuthModule,
    PrescriptionModule,
    AllergyModule,
    SurgeryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule { }
