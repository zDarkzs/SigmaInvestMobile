import { Colors } from './Colors';

export const CommonStyles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 48,
    fontWeight: 'bold' as const,
    color: Colors.primary,
    borderBottomWidth: 1,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: Colors.primary,
    borderBottomColor: Colors.primary,
    margin: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: Colors.white,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center' as const,
    marginVertical: 10,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold' as const,
    fontSize: 16,
  },
  warningText: {
    color: Colors.warning,
    fontWeight: 'bold' as const,
    fontSize: 22,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  modalContainer: {
    maxWidht:'50%',
    margin: '10%',
    backgroundColor: Colors.backgroundDark,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center' as const,
    justifyContent: 'flex-start' as const,
    gap: 12,
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  borderRadius: 10,

  modalTopRight: {
  position: 'absolute' as const,
  top: 40,
  right: 20,
  width: '80%',
  backgroundColor: Colors.backgroundDark,
  borderRadius: 10,
  padding: 16,
  shadowColor: Colors.black,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5,
},

};

