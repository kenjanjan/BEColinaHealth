import { ObjectType, Field, Int } from '@nestjs/graphql';
import { MedicationLogs } from 'src/medicationLogs/entities/medicationLogs.entity';
import { Patients } from 'src/patients/entities/patients.entity';
import { PrescriptionsFiles } from 'src/prescriptionsFiles/entities/prescriptionsFiles.entity';
import {
  ManyToOne,
  JoinColumn,
  Column,
  PrimaryGeneratedColumn,
  Entity,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
@Entity('prescriptions')
@ObjectType()
export class Prescriptions {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  uuid: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  status: string;

  @Column()
  dosage: string;

  @Column()
  frequency: string;

  @Column()
  interval: string;

  // @Column()
  // maintenance: boolean;

  @Column({ nullable: true })
  @Field(() => Int)
  patientId: number;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  @Field()
  updatedAt: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  @Field()
  createdAt: string;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  @Field()
  deletedAt: string;

  @ManyToOne(() => Patients, (patient) => patient.prescriptions)
  @JoinColumn({ name: 'patientId' }) // FK attribute
  patient: Patients;

  // @OneToMany(() => MedicationLogs, medicationLogs => medicationLogs.prescriptions)
  // @Field(() => [MedicationLogs], { nullable: true })
  // medicationLogs: MedicationLogs[];
  @OneToMany(() => PrescriptionsFiles, (file) => file.prescription)
  @JoinColumn({ name: 'id' }) // Specify the column name for the primary key
  prescriptionFile?: PrescriptionsFiles;

  //Prescription to MedicationLogs
  @OneToMany(
    () => MedicationLogs,
    (medicationlogs) => medicationlogs.prescription,
  )
  medicationlogs: MedicationLogs[];
}
