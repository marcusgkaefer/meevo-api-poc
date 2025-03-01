import { useState, useEffect } from "react";
import { Service } from "@/types";
import { getServices, getProfessionalsByService } from "@/utils/api";
import { getToken } from "@/utils/apiClient";
import { cn } from "@/lib/utils";
import { Clock, Star, Users, Search, Check } from "lucide-react";

interface ServiceSelectionProps {
  onSelect: (service: Service) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ onSelect }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { access_token } = await getToken();
        const data = await getServices(access_token);
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = services.filter(
    (service) =>
      service?.name &&
      service?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleServiceClick = async (service: Service, index: number) => {
    setSelectedIndex(index);
    // Add small delay to show the selection animation before proceeding
    setTimeout(async () => {
      try {
        const specialists = await getProfessionalsByService(service.id);
        console.log("Specialists for service", service.name, specialists);
        onSelect(service);
      } catch (error) {
        console.error("Failed to fetch specialists:", error);
      }
    }, 300);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-1">Select a Service</h2>
        <p className="text-muted-foreground">
          Choose the waxing service you need
        </p>
      </div>

      <div className="relative mb-6 group">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search services..."
          className="w-full pl-10 pr-4 py-3 rounded-lg border transition-all bg-background focus:outline-none focus:ring-2 focus:ring-custom-secondary/30 focus:border-custom-secondary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border p-4 h-28 shimmer animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))
        ) : filteredServices.length > 0 ? (
          filteredServices.map((service, index) => {
            const isSelected = selectedIndex === index;

            return (
              <div
                key={service.id}
                className={cn(
                  "rounded-xl transition-all duration-300 shadow-sm hover:shadow-md",
                  "transform hover:-translate-y-1 active:translate-y-0 overflow-hidden",
                  "border cursor-pointer relative group",
                  isSelected
                    ? "ring-2 ring-custom-secondary border-custom-secondary/50"
                    : "hover:border-primary/40"
                )}
                onClick={() => handleServiceClick(service, index)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Overlay for selected state */}
                {isSelected && (
                  <div className="absolute inset-0 bg-custom-secondary/10 z-10 flex items-center justify-center animate-fade-in">
                    <div className="bg-white rounded-full p-1 shadow-md">
                      <Check className="text-custom-secondary h-5 w-5 animate-scale-in" />
                    </div>
                  </div>
                )}

                <div className="flex p-4 items-start space-x-4">
                  {/* Service image */}
                  <div className="relative flex-shrink-0">
                    {service.imageUrl ? (
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="h-16 w-16 object-cover rounded-lg shadow-sm group-hover:shadow transform transition-all duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-custom-primary/90 to-custom-secondary/80 flex items-center justify-center text-white shadow-sm group-hover:shadow transition-all duration-300 group-hover:scale-105">
                        <span className="text-lg font-medium">
                          {service.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Service details */}
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{service.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {service.description}
                    </p>

                    {/* Service metadata chips */}
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                        <Clock size={12} />
                        <span>{service.duration} min</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs">
                        <Users size={12} />
                        <span>2 specialists</span>
                      </span>

                      {/* Random star rating for demo */}
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs">
                        <Star
                          size={12}
                          className="fill-amber-500 text-amber-500"
                        />
                        <span>{(4 + Math.random()).toFixed(1)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Price tag - Smoother display */}
                  <div className="flex-shrink-0 self-start">
                    <div className="bg-gradient-to-r from-custom-primary/10 to-custom-secondary/20 text-custom-secondary font-semibold px-4 py-2 rounded-lg shadow-sm transition-all group-hover:shadow group-hover:scale-105">
                      ${service.price}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center p-8 border border-dashed rounded-xl bg-muted/30">
            <p className="text-muted-foreground">
              No services found matching "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceSelection;
