import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, MapPin, X, Check } from 'lucide-react';
import { Address } from '../types';

interface AddressesViewProps {
  addresses: Address[];
  selectedAddressId: string | null;
  onSelectAddress: (id: string) => void;
  onSaveAddress: (address: Address) => void;
  onDeleteAddress: (id: string) => void;
  onContinueToOrder?: () => void;
  showContinueButton?: boolean;
}

export const AddressesView: React.FC<AddressesViewProps> = ({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onSaveAddress,
  onDeleteAddress,
  onContinueToOrder,
  showContinueButton = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [street, setStreet] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Deutschland');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingAddress(null);
    setFirstName('');
    setLastName('');
    setStreet('');
    setHouseNumber('');
    setPostalCode('');
    setCity('');
    setCountry('Deutschland');
    setPhone('');
    setFormError(null);
    setIsEditing(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setFirstName(addr.firstName);
    setLastName(addr.lastName);
    setStreet(addr.street);
    setHouseNumber(addr.houseNumber);
    setPostalCode(addr.postalCode);
    setCity(addr.city);
    setCountry(addr.country);
    setPhone(addr.phone || '');
    setFormError(null);
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !street.trim() || !houseNumber.trim() || !postalCode.trim() || !city.trim() || !country.trim()) {
      setFormError('Bitte fülle alle Pflichtfelder aus.');
      return;
    }

    const newAddr: Address = {
      id: editingAddress?.id || `addr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      street: street.trim(),
      houseNumber: houseNumber.trim(),
      postalCode: postalCode.trim(),
      city: city.trim(),
      country: country.trim(),
      phone: phone.trim() ? phone.trim() : undefined,
      createdAt: editingAddress?.createdAt || Date.now(),
    };

    onSaveAddress(newAddr);
    setIsEditing(false);
  };

  return (
    <div id="addresses-view" className="max-w-[390px] mx-auto px-6 py-5 pb-24 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h1 className="text-xl font-light tracking-[0.2em] text-white uppercase">Lieferadressen</h1>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">
            {addresses.length} {addresses.length === 1 ? 'ADRESSE' : 'ADRESSEN'}
          </p>
        </div>
        <button
          id="add-new-address-btn"
          onClick={openAddModal}
          className="flex items-center gap-1 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] font-medium text-white hover:bg-white/10 transition active:scale-95 uppercase tracking-wider"
        >
          <Plus className="w-3.5 h-3.5 text-[#FF3B30]" />
          <span>Neu</span>
        </button>
      </div>

      {/* Address List */}
      {addresses.length === 0 ? (
        <div className="rounded-2xl bg-[#111] border border-dashed border-white/10 p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.02] mx-auto flex items-center justify-center text-white/40">
            <MapPin className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-white">Keine Adresse hinterlegt</p>
            <p className="text-xs text-white/40 leading-relaxed">
              Füge eine Lieferadresse hinzu, um deine Bestellung abzuschließen.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="h-11 px-6 rounded-xl bg-white text-black font-bold text-[11px] uppercase tracking-widest transition hover:bg-neutral-200 active:scale-95 inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adresse anlegen</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => {
            const isSelected = selectedAddressId === addr.id;

            return (
              <div
                key={addr.id}
                id={`address-card-${addr.id}`}
                onClick={() => onSelectAddress(addr.id)}
                className={`relative rounded-2xl p-4 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#141414] border-[#FF3B30] shadow-[0_0_15px_rgba(255,59,48,0.15)]'
                    : 'bg-[#111] border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isSelected ? (
                        <div className="w-4 h-4 rounded-full border border-[#FF3B30] flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-[#FF3B30] shadow-[0_0_6px_#FF3B30]" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-white/20" />
                      )}
                    </div>

                    <div className="space-y-0.5 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white text-sm">
                          {addr.firstName} {addr.lastName}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#FF3B30]/10 text-[#FF3B30] border border-[#FF3B30]/30 font-medium">
                            Aktiv
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/50">
                        {addr.street} {addr.houseNumber}
                      </p>
                      <p className="text-xs text-white/50">
                        {addr.postalCode} {addr.city}
                      </p>
                      <p className="text-[11px] text-white/30">{addr.country}</p>
                      {addr.phone && (
                        <p className="text-[11px] text-white/40 mt-1">Tel: {addr.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    className="flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => openEditModal(addr)}
                      className="p-1.5 text-white/40 hover:text-white transition rounded-lg hover:bg-white/5"
                      title="Bearbeiten"
                      aria-label="Adresse bearbeiten"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteAddress(addr.id)}
                      className="p-1.5 text-white/40 hover:text-[#FF3B30] transition rounded-lg hover:bg-white/5"
                      title="Löschen"
                      aria-label="Adresse löschen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Optional button to proceed back to checkout */}
      {showContinueButton && addresses.length > 0 && selectedAddressId && onContinueToOrder && (
        <button
          onClick={onContinueToOrder}
          className="w-full h-14 rounded-2xl bg-white text-black font-bold text-[13px] uppercase tracking-widest transition hover:bg-neutral-200 active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl"
        >
          <span>Adresse übernehmen</span>
          <Check className="w-4 h-4" />
        </button>
      )}

      {/* Add/Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div
            id="address-modal"
            className="w-full max-w-[390px] rounded-3xl bg-[#0e0e12] border border-white/10 p-6 shadow-2xl relative my-8"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h2 className="text-base font-light tracking-[0.15em] text-white uppercase">
                {editingAddress ? 'Adresse bearbeiten' : 'Neue Lieferadresse'}
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 text-white/40 hover:text-white rounded-lg transition"
                aria-label="Schließen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-red-950/40 border border-red-900/60 text-xs text-red-300">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">
                    Vorname *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Max"
                    className="w-full h-10 px-3 rounded-xl bg-black border border-white/10 text-white text-sm focus:border-white/40 focus:outline-none transition placeholder:text-white/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">
                    Nachname *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Mustermann"
                    className="w-full h-10 px-3 rounded-xl bg-black border border-white/10 text-white text-sm focus:border-white/40 focus:outline-none transition placeholder:text-white/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">
                    Straße *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Musterstraße"
                    className="w-full h-10 px-3 rounded-xl bg-black border border-white/10 text-white text-sm focus:border-white/40 focus:outline-none transition placeholder:text-white/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">
                    Hausnr. *
                  </label>
                  <input
                    type="text"
                    required
                    value={houseNumber}
                    onChange={(e) => setHouseNumber(e.target.value)}
                    placeholder="10"
                    className="w-full h-10 px-3 rounded-xl bg-black border border-white/10 text-white text-sm focus:border-white/40 focus:outline-none transition placeholder:text-white/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">
                    PLZ *
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="12345"
                    className="w-full h-10 px-3 rounded-xl bg-black border border-white/10 text-white text-sm focus:border-white/40 focus:outline-none transition placeholder:text-white/20"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">
                    Ort *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Berlin"
                    className="w-full h-10 px-3 rounded-xl bg-black border border-white/10 text-white text-sm focus:border-white/40 focus:outline-none transition placeholder:text-white/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">
                  Land *
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Deutschland"
                  className="w-full h-10 px-3 rounded-xl bg-black border border-white/10 text-white text-sm focus:border-white/40 focus:outline-none transition placeholder:text-white/20"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">
                  Telefonnummer <span className="text-white/25">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+49 170 1234567"
                  className="w-full h-10 px-3 rounded-xl bg-black border border-white/10 text-white text-sm focus:border-white/40 focus:outline-none transition placeholder:text-white/20"
                />
              </div>

              <div className="flex items-center gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 font-medium text-xs transition uppercase tracking-wider"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest transition hover:bg-neutral-200 active:scale-95 shadow-md"
                >
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
